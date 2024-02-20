import React from "react";
import { useCallback } from "react";
import { useModalContext } from "../utils/modalUtils";
import { useGlobalContext } from "../utils/globalUtils";

import {
    Card, CardContent, CardActionArea, CardActions,
    Typography, Box, IconButton, Tooltip, useTheme
} from "@mui/material"
import EventNoteIcon from '@mui/icons-material/EventNote';
import ForumIcon from '@mui/icons-material/Forum';
import DescriptionIcon from '@mui/icons-material/Description';
import ReportIcon from '@mui/icons-material/Report';

const Shift = ({ featured, shift }) => {
    const { dispatch } = useGlobalContext();
    // Get modal dispatch method to toggle modal from shift card
    const { modalDispatch } = useModalContext();
    const theme = useTheme();

    // Open the shift details drawer and close the modal
    const openShift = useCallback((subPanel) => {
        dispatch({
            type: "setSelectedShift",
            data: shift
        });
        modalDispatch({
            type: "close",
            data: "modal"
        });
        modalDispatch({
            type: "open",
            data: "drawer"
        });
        if (subPanel) {
            modalDispatch({
                type: "setActiveDrawer",
                data: subPanel
            });
        }
    }, [modalDispatch, dispatch, shift]);

    return (
        <Card variant="outlined" className={featured ? "shift featured" : "shift"} data-testid="card"
            sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: { lg: "column" },
                '&:hover': { cursor: "pointer" }
            }}
            onClick={(event) => {
                let subPanel;
                switch (event.target.className) {
                    case "shift-button-handover": subPanel = "handover notes"; break;
                    case "shift-button-notes": subPanel = "shift notes"; break;
                    case "shift-button-incidents": subPanel = "incident reports"; break;
                    default: subPanel = null;
                }
                if (subPanel) {
                    openShift(subPanel);
                } else {
                    openShift();
                }
            }}>
            <CardActionArea onClick={openShift}>
                <CardContent sx={{
                    display: "grid",
                    gridTemplate: "repeat(2, 1fr) / auto 1fr",
                    alignItems: "center",
                }}>
                    <Box sx={{ display: "flex", gridArea: "1 / 1 / 2 / 2", [theme.breakpoints.down("sm")]: { gridArea: "1 / 1 / 2 / 3" } }}>
                        <EventNoteIcon sx={{ mr: "0.5rem" }} />
                        <Typography variant="body1" className="shift-date">
                            {shift ? new Date(shift.shiftStartTime)
                                .toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" }) : "Could not load shift time"}
                        </Typography>
                    </Box>
                    <Box sx={{ gridArea: "2 / 1 / 3 / 2", [theme.breakpoints.down("sm")]: { gridArea: "2 / 1 / 3 / 3" } }}>
                        <Typography variant="body1" className="shift-carer">
                            Carer: {shift.carer.firstName} {shift.carer.lastName}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
            {/* Show shift buttons only on larger screen sizes */}
            <CardActions sx={{
                width: "100%",
                justifyContent: { xs: "flex-end", lg: "flex-start" },
            }}>
                <Box className="shift-buttons"
                    sx={{
                        display: "flex",
                        flexShrink: 0,
                        pr: 1,
                        [theme.breakpoints.down("sm")]: { display: "none" },
                    }}>
                    <Tooltip title="Handover">
                        <IconButton className="shift-button-handover" data-testid="handover"
                            onClick={() => openShift("handover notes")}>
                            <ForumIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Shift Notes">
                        <IconButton className="shift-button-notes" data-testid="notes"
                            onClick={() => openShift("shift notes")}>
                            <DescriptionIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Incident Reports">
                        <IconButton className="shift-button-incidents" data-testid="incidents"
                            onClick={() => openShift("incident reports")}>
                            <ReportIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </CardActions>
        </Card>
    );
}

export default Shift