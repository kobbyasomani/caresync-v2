import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../utils/globalUtils";

import { Card, CardContent, Avatar, CardMedia, Typography, CardActionArea } from "@mui/material"
import PersonIcon from '@mui/icons-material/Person';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { Theme as theme } from "../styles/Theme";

const Patient = () => {
    const { store, dispatch } = useGlobalContext();
    const { _id, firstName, lastName } = store.selectedPatient;
    const navigate = useNavigate();

    // let caringFor;

    const switchPatient = useCallback(() => {
        // Unset selected patient
        dispatch({
            type: "setSelectedPatient",
            data: ""
        });
        // Navigate to patient selection
        navigate("/");
    }, [dispatch, navigate])

    return (
        <Card variant="outlined" id={_id} className="patient selected">
            <CardActionArea
                onClick={switchPatient}
                sx={{
                    display: "grid",
                    gridTemplate: "repeat(2, auto) / auto 1fr",
                    // columnGap: "1rem",
                    // alignItems: "center"
                }}>
                <CardMedia sx={{ px: 2 }}>
                    <div className="icon">
                        <Avatar sx={{ backgroundColor: theme.palette.primary.light, height: "2rem", width: "2rem" }}>
                            <PersonIcon fontSize="medium" />
                        </Avatar>
                    </div>
                </CardMedia>
                <CardContent sx={{ display: "flex", pl: 0 }}>
                    <Typography variant="body1" className="name" sx={{ fontWeight: "600" }}>
                        {firstName} {lastName}
                    </Typography>
                    <SwapHorizIcon sx={{ ml: "auto" }} />
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default Patient;