import React from "react";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../utils/globalUtils";
import { useModalContext } from "../utils/modalUtils";
import { Theme as theme } from "../styles/Theme";

import { Card, CardContent, Avatar, CardMedia, Typography, CardActionArea, Tooltip } from "@mui/material"
import PersonIcon from '@mui/icons-material/Person';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';

const SwitchClient = () => {
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const { _id, firstName, lastName } = store.selectedClient;
    const navigate = useNavigate();

    const handleSwitchClient = useCallback(() => {
        navigate("/clients");
    }, [navigate]);

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
    }, [dispatch, modalDispatch, store.selectedClient]);

    return (
        <Tooltip title="Switch Client" placement="bottom" >
            <Card variant="outlined" id={_id} className="client selected" sx={{ width: "100%" }}>
                <CardActionArea
                    onClick={handleSwitchClient}
                    sx={{
                        display: "grid",
                        gridTemplate: "repeat(2, auto) / auto 1fr",
                        // columnGap: "1rem",
                        // alignItems: "center"
                    }}>
                    <CardMedia sx={{ px: 2 }}>
                        <div className="icon">
                            <Avatar sx={{ backgroundColor: theme.palette.primary.main, height: "2rem", width: "2rem" }}>
                                <PersonIcon fontSize="medium" />
                            </Avatar>
                        </div>
                    </CardMedia>
                    <CardContent sx={{ display: "flex", pl: 0 }}>
                        <Typography variant="body1" className="name" sx={{ fontWeight: "600" }}>
                            {firstName} {lastName}
                        </Typography>
                        <SwapHorizRoundedIcon sx={{ ml: "auto" }} />
                    </CardContent>
                </CardActionArea>
            </Card>
        </Tooltip>
    );
}

export default SwitchClient;