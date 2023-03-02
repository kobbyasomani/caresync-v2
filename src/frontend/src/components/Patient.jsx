import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../utils/globalUtils";

import { Card, CardContent, Avatar, CardMedia, Typography, CardActionArea } from "@mui/material"
import PersonIcon from '@mui/icons-material/Person';
import { Theme as theme } from "../styles/Theme";

const Patient = ({ patient }) => {
    const { dispatch } = useGlobalContext();
    const navigate = useNavigate();

    // Get the next shift date for patient and the associated carer
    let caringFor;
    let nextShiftDate = () => {
        if (patient.nextShift) {
            if (typeof patient.nextShift === "string") {
                return new Date(patient.nextShift).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" });
            }
            if (patient.nextShift.carerName === "You") {
                caringFor = true;
            }
            return new Date(patient.nextShift.time).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" });
        }
        return "No upcoming shift";
    }

    const selectPatient = (event) => {
        dispatch({
            type: "setSelectedPatientById",
            data: event.currentTarget.id
        });
        // Redirect to calendar after selecting a patient
        navigate("/calendar");
    }

    return (
        <Card variant="outlined" id={patient._id} className="patient"
            onClick={selectPatient}>
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
                        {patient.firstName} {patient.lastName}
                    </Typography>
                    <Typography variant="body1" className="shift">
                        Next shift: {`${nextShiftDate()} 
                        ${(patient.nextShift?.carerName
                                && patient.nextShift.carerName !== "You") ? `(${patient.nextShift.carerName})`
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

export default Patient;