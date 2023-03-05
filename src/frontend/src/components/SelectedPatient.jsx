import React from "react";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../utils/globalUtils";
import { useModalContext } from "../utils/modalUtils";

import { Card, CardContent, Avatar, CardMedia, Typography, CardActionArea, Tooltip } from "@mui/material"
import PersonIcon from '@mui/icons-material/Person';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { Theme as theme } from "../styles/Theme";

const Patient = () => {
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const { _id, firstName, lastName } = store.selectedPatient;
    const navigate = useNavigate();

    const switchPatient = useCallback(() => {
        // Unset selected patient
        dispatch({
            type: "setSelectedPatient",
            data: {}
        });
        // Navigate to patient selection
        navigate("/");
    }, [dispatch, navigate])

    // Logout user if auth fails
    useEffect(() => {
        // console.log("authenticating: ", document.cookie.includes("authenticated=true"));
        if (document.cookie.includes("authenticated=true") === false) {
            dispatch({
                type: "logout",
            });
            modalDispatch({
                type: "closeAllModals"
            });
        }
    }, [dispatch, modalDispatch, store.selectedPatient]);

    return (
        <Tooltip title="Switch Patient" placement="right" >
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
        </Tooltip>
    );
}

export default Patient;