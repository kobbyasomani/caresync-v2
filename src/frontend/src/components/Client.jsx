import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../utils/globalUtils";

import { Card, CardContent, Avatar, CardMedia, Typography, CardActionArea } from "@mui/material"
import PersonIcon from '@mui/icons-material/Person';
import { Theme as theme } from "../styles/Theme";

const Client = ({ client }) => {
    const { dispatch } = useGlobalContext();
    const [caringFor, setCaringFor] = useState(false);
    const [nextShiftDate, setNextShiftDate] = useState("");
    const navigate = useNavigate();

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

    const handleSelectClient = (event) => {
        dispatch({
            type: "setSelectedClientById",
            data: client._id
        });
        navigate("/calendar");
    }

    useEffect(() => {
        getNextShiftDate();
    }, [getNextShiftDate]);

    return (
        <Card variant="outlined" id={client._id} className="client">
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
        </Card>
    );
}

export default Client;