import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../utils/globalStateContext";

import { Card, CardContent, Avatar, CardMedia, Typography, CardActionArea } from "@mui/material"
import PersonIcon from '@mui/icons-material/Person';
import { Theme as theme } from "../styles/Theme";

const Patient = ({ patient }) => {
    const { dispatch } = useGlobalState();
    const { _id, firstName, lastName, nextShift } = patient;
    const navigate = useNavigate();

    let caringFor;
    let nextShiftDate = () => {
        if (nextShift) {
            if (typeof nextShift === "string") {
                return new Date(nextShift).toLocaleString();
            }
            caringFor = true;
            return new Date(nextShift[0].time).toLocaleString();
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
        <Card variant="outlined" id={_id} className="patient"
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
                        {firstName} {lastName}
                    </Typography>
                    <Typography variant="body1" className="shift">
                        Next shift: {nextShiftDate()}
                    </Typography>
                    {caringFor ? <Typography variant="subtitle1" className="caring-for" color="primary">You are the carer for this shift.</Typography> : null}
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default Patient;