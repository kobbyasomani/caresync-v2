import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../utils/globalUtils";
import { useModalContext } from "../utils/modalUtils";
import { getClient, deleteClient, getClientList, getAllShifts, cancelShift } from "../utils/apiUtils";
import { Theme as theme } from "../styles/Theme";
import Confirmation from "./dialogs/Confirmation";

import {
    Card, CardContent, Avatar, CardMedia, Typography, CardActionArea,
    IconButton, Tooltip,
} from "@mui/material"
import PersonIcon from '@mui/icons-material/Person';
import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';

const Client = ({ client }) => {
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const [caringFor, setCaringFor] = useState(false);
    const [nextShiftDate, setNextShiftDate] = useState("");
    const navigate = useNavigate();
    const userIsCoordinator = client.coordinator === store.user._id;
    const modalId = useMemo(() => `removeClient_${client._id}`, [client._id]);
    const [isConfirmed, setIsConfirmed] = useState(false);

    // Get the next shift date for client and the associated carer
    let getNextShiftDate = useCallback(() => {
        let nextShift = "";
        if (client.nextShift) {
            if (typeof client.nextShift === "string") {
                nextShift = new Date(client.nextShift).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" });
            } else if (typeof client.nextShift === "object") {
                nextShift = new Date(client.nextShift.time).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" });
            }
            if (client.nextShift.carerName === "You") {
                setCaringFor(true);
            }
            setNextShiftDate(nextShift);
        }
    }, [client]);

    const handleSelectClient = useCallback(async (event) => {
        const clientData = await getClient(client._id);
        dispatch({
            type: "setSelectedClient",
            data: clientData
        });
        navigate("/calendar");
    }, [client._id, dispatch, navigate]);

    const handleConfirmRemoveClient = useCallback(() => {
        // Check if the client has shifts. If so, warn user that all client shifts will be deleted.
        modalDispatch({
            type: "open",
            data: "confirmation",
            id: modalId
        });
    }, [modalDispatch, modalId]);

    const removeClient = useCallback(() => {
        getAllShifts(client._id).then(shifts => {
            return Promise.all(shifts.map(shift => cancelShift(shift._id)));
        }).then(() => deleteClient(client._id))
            .then(() => {
                setIsConfirmed(true);
                ["selectedClient", "prevSelectedClient"].forEach(selectedClient => {
                    if (store[selectedClient]._id === client._id) {
                        dispatch({
                            type: "updateStore",
                            data: {
                                [selectedClient]: {}
                            }
                        });
                    }
                });
            });
    }, [client, dispatch, store]);

    const handleAfterRemoveClient = useCallback(() => {
        getClientList().then(clients => {
            dispatch({
                type: "setClients",
                data: clients
            });
        });
        setIsConfirmed(false);
    }, [dispatch]);

    useEffect(() => {
        getNextShiftDate();
    }, [getNextShiftDate]);

    return (
        <>
            <Card variant="outlined" id={client._id} className="client" sx={{ position: "relative" }}>
                <CardActionArea sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center"
                }} onClick={handleSelectClient}>
                    <CardMedia sx={{ px: 2 }}>
                        <Avatar sx={{ backgroundColor: theme.palette.primary.main }}>
                            <PersonIcon fontSize="large" />
                        </Avatar>
                    </CardMedia>
                    <CardContent>
                        <Typography variant="body1" className="name" sx={{ fontWeight: "600" }}>
                            {client.firstName} {client.lastName}
                        </Typography>
                        <Typography variant="body1" className="shift">
                            {nextShiftDate ? `Next shift: ${nextShiftDate}` : "No upcoming shift"}
                        </Typography>
                        {client.nextShift?.carerName
                            && client.nextShift.carerName !== "You" ? (
                            <Typography variant="subtitle1">
                                Carer: {client.nextShift.carerName}
                            </Typography>
                        ) : null}
                        {caringFor ? (
                            <Typography variant="subtitle1" className="caring-for" color="primary">
                                You are the carer for this shift.
                            </Typography>
                        ) : null}
                    </CardContent>
                </CardActionArea>
                {userIsCoordinator && removeClient ? (
                    <Tooltip title="Remove client" placement="left">
                        <IconButton onClick={handleConfirmRemoveClient} aria-label="Remove client"
                            sx={{ position: "absolute", top: "0.25rem", right: "0.25rem" }}>
                            <PersonRemoveRoundedIcon />
                        </IconButton>
                    </Tooltip>
                ) : null}
            </Card>

            <Confirmation title={isConfirmed ? "Client removed" : "Confirm remove client"}
                text={isConfirmed ? "The client has been removed from your client list."
                    : `Are you sure you want to remove ${client.firstName} ${client.lastName}
                    from your client list? All shifts associated with this client will be
                    permanently deleted.`}
                callback={removeClient}
                modalId={modalId}
                sx={{ ml: { sm: "2.5rem" } }}
                cancelText="Keep client"
                confirmText={<><PersonRemoveRoundedIcon />&nbsp;Remove</>}
                successAlert={`${client.firstName} ${client.lastName} was successfully removed.`}
                stayOpenOnConfirm
                afterConfirm={handleAfterRemoveClient}
            />
        </>
    );
}

export default Client;