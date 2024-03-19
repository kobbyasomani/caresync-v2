import React from "react";
import { useCallback } from "react";
import { useModalContext } from "../utils/modalUtils";
import { useGlobalContext } from "../utils/globalUtils";

import {
    Card, CardContent, CardActionArea, CardActions,
    Typography, Box, IconButton, Tooltip, useTheme
} from "@mui/material"
import EventNoteIcon from '@mui/icons-material/EventNote';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import DescriptionIcon from '@mui/icons-material/Description';
import ReportRoundedIcon from '@mui/icons-material/ReportRounded';
import AssignmentIcon from '@mui/icons-material/Assignment';

const Shift = ({ featured, shift }) => {
    const { dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const theme = useTheme();

    const handleOpenShift = useCallback((event, subPanel) => {
        event.preventDefault();
        event.stopPropagation();
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
            data: "drawer",
            view: subPanel || ""
        });
    }, [modalDispatch, dispatch, shift]);

    return (
        <Card variant="outlined" className={featured ? "shift featured" : "shift"}
            data-testid="card" id={`shift_${shift._id}`}
            sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: { lg: "column" },
                '&:hover': { cursor: "pointer" }
            }}
            onClick={handleOpenShift}>
            <CardActionArea onClick={handleOpenShift}>
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
                width: "100%", justifyContent: { xs: "flex-end", lg: "flex-start" },
                [theme.breakpoints.down("sm")]: { display: "none" }
            }}>
                <Box className="shift-buttons"
                    sx={{
                        display: "flex",
                        flexShrink: 0,
                        pr: 1,
                    }}>
                    <Tooltip title="Coordinator Notes">
                        <IconButton className="shift-button-coordinator-notes" data-testid="coordinator-notes"
                            onClick={(event) => handleOpenShift(event, "coordinator notes")}
                            sx={{
                                color: shift.coordinatorNotes ?
                                    theme.palette.primary.main : "inital"
                            }}>
                            <AssignmentIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Shift Notes">
                        <IconButton className="shift-button-shift-notes" data-testid="notes"
                            onClick={(event) => handleOpenShift(event, "shift notes")}
                            sx={{
                                color: shift.shiftNotes?.shiftNotesText ?
                                    theme.palette.primary.main : "inital"
                            }}>
                            <DescriptionIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Handover">
                        <IconButton className="shift-button-handover" data-testid="handover"
                            onClick={(event) => handleOpenShift(event, "handover notes")}
                            sx={{
                                color: shift.handoverNotes ?
                                    theme.palette.primary.main : "inital"
                            }}>
                            <ForumRoundedIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Incident Reports">
                        <IconButton className="shift-button-incidents" data-testid="incidents"
                            onClick={(event) => handleOpenShift(event, "incident reports")}
                            sx={{
                                color: shift.incidentReports?.length > 0 ?
                                    theme.palette.error.main : "inital"
                            }}>
                            <ReportRoundedIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </CardActions>
        </Card>
    );
}

export default Shift