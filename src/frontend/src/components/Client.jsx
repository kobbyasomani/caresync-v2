import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../utils/globalUtils";

import { Card, CardContent, Avatar, CardMedia, Typography, CardActionArea } from "@mui/material"
import PersonIcon from '@mui/icons-material/Person';
import { Theme as theme } from "../styles/Theme";

const Client = ({ client }) => {
    const { dispatch } = useGlobalContext();
    const navigate = useNavigate();

    // Get the next shift date for client and the associated carer
    let caringFor;
    let nextShiftDate = () => {
        if (client.nextShift) {
            if (typeof client.nextShift === "string") {
                return new Date(client.nextShift).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" });
            }
            if (client.nextShift.carerName === "You") {
                caringFor = true;
            }
            return new Date(client.nextShift.time).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" });
        }
        return "No upcoming shift";
    }

    const selectClient = (event) => {
        dispatch({
            type: "setSelectedClientById",
            data: event.currentTarget.id
        });
        // Redirect to calendar after selecting a client
        navigate("/calendar");
    }

    return (
        <Card variant="outlined" id={client._id} className="client"
            onClick={selectClient}>
            <CardActionArea sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center"
            }}>
                <CardMedia sx={{ px: 2 }}>
                    <div className="icon">
                        <Avatar sx={{ backgroundColor: theme.palette.primary.light }}>
                            <PersonIcon fontSize="large" />
                        </Avatar>
                    </div>
                </CardMedia>
                <CardContent>
                    <Typography variant="body1" className="name" sx={{ fontWeight: "600" }}>
                        {client.firstName} {client.lastName}
                    </Typography>
                    <Typography variant="body1" className="shift">
                        Next shift: {`${nextShiftDate()} 
                        ${(client.nextShift?.carerName
                                && client.nextShift.carerName !== "You") ? `(${client.nextShift.carerName})`
                                : ""}`}
                    </Typography>
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