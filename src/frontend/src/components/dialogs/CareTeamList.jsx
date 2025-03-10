import { useState, useCallback, useEffect } from "react";
import axios from "axios";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import Modal from "../Modal";
import { ButtonPrimary, ButtonSecondary } from "../root/Buttons";
import Carer from "../Carer";
import Loader from "../logo/Loader";

import { List, Stack } from "@mui/material"
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const CareTeamList = () => {
    // TODO: Handle cases where a carer with pending/in-progress shift is removed from a care team
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();

    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState({});
    const clearAlert = useCallback(() => {
        setAlert({});
    }, []);
    const client = store.selectedClient;
    const { carers, coordinator } = store.selectedClient;
    const userIsCoordinator = store.selectedClient.isCoordinator;

    // Opens carer invitation dialog
    const handleInviteCarer = useCallback(() => {
        modalDispatch({
            type: "open",
            data: "modal",
            id: "invite-carer"
        });
        clearAlert();
    }, [modalDispatch, clearAlert]);

    // Add logged-in user to the care team if they are the coordinator
    const handleAddCoordinatorAsCarer = useCallback(() => {
        setIsLoading(true);
        axios.post("/carer/add-coordinator-as-carer", {
            "coordinatorID": store.user._id,
            "clientID": store.selectedClient._id
        }).then(response => {
            setAlert({
                message: "You have been added to the care team.",
                severity: "success"
            });
            dispatch({
                type: "refreshCalendar",
            });
            setIsLoading(false);
        }).catch(error => setAlert({
            message: error.response.data.message,
            severity: "error"
        }));
    }, [store.user._id, store.selectedClient._id, dispatch]);

    // Remove a carer from the selected client
    const removeCarer = useCallback((carer) => {
        setIsLoading(true);
        axios.delete(`carer/remove/${store.selectedClient._id}/${carer._id}`)
            .then(() => {
                let message;
                if (carer._id === store.user._id) {
                    message = "You were removed from the care team."
                } else {
                    message = `${carer.firstName} ${carer.lastName} was removed from the care team.`;
                }
                setAlert({
                    message: message,
                    severity: "success"
                });
                dispatch({
                    type: "refreshCalendar",
                })
                setIsLoading(false);
            }).catch(error => setAlert({
                message: error.response.data.message,
                severity: "error"
            }));
    }, [store.selectedClient, store.user._id, dispatch]);

    const handleOnClose = useCallback(() => {
        clearAlert();
    }, [clearAlert]);

    useEffect(() => {
        setIsLoading(false);
    }, [client, store.selectedClient]);

    return <Modal modalId="care-team-list"
        title={`Care team for ${store.selectedClient.firstName} ${store.selectedClient.lastName}`}
        text={`These are the members of this client's care team. You can 
                invite users to, or remove them from, the client's care team here.`}
        alert={{ severity: alert?.severity, message: alert?.message }}
        actions={userIsCoordinator ?
            (<>
                <ButtonPrimary onClick={handleInviteCarer}
                    startIcon={<PersonAddAltRoundedIcon />}
                    disabled={isLoading}>
                    Add Carer
                </ButtonPrimary>
                {store.selectedClient.coordinator._id === store.user._id
                    && !store.selectedClient.carers.some(obj => obj["_id"] === store.user._id) ? (
                    <ButtonSecondary onClick={handleAddCoordinatorAsCarer}
                        startIcon={<AccountCircleRoundedIcon />}
                        disabled={isLoading}>
                        Add yourself
                    </ButtonSecondary>
                ) : (null)
                }
            </>)
            : null}
        onClose={handleOnClose}
    >
        {isLoading ? <Loader /> : (
            <>
                <List>
                    <Stack spacing={2} key="carer-list">
                        <Carer key={coordinator._id} carer={coordinator} removeCarer={() => removeCarer(coordinator)} />
                        {carers.length > 0 ? carers.filter(carer => carer._id !== store.selectedClient.coordinator._id)
                            .map(carer => {
                                return <Carer key={carer._id} carer={carer} removeCarer={() => removeCarer(carer)} />
                            }) : null}
                    </Stack>
                </List>
            </>
        )}
    </Modal >
}

export default CareTeamList