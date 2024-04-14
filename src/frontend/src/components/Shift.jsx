import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../utils/globalUtils";

import {
    Card, CardContent, CardActionArea, CardActions,
    Typography, Box, Stack, IconButton, Tooltip, useTheme
} from "@mui/material"
import EventNoteIcon from '@mui/icons-material/EventNote';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import DescriptionIcon from '@mui/icons-material/Description';
import ReportRoundedIcon from '@mui/icons-material/ReportRounded';
import AssignmentIcon from '@mui/icons-material/Assignment';

const Shift = ({ featured, shift, cardDirection }) => {
    const { dispatch } = useGlobalContext();
    const theme = useTheme();
    const navigate = useNavigate();

    const handleOpenShift = useCallback((event, subPanel) => {
        event.preventDefault();
        event.stopPropagation();
        dispatch({
            type: "setSelectedShift",
            data: shift
        });
        navigate(`/calendar/shift-details/${subPanel || ""}`);
    }, [dispatch, shift, navigate]);

    return (
        <Card variant="outlined" className={featured ? "shift featured" : "shift"}
            data-testid="card" id={`shift_${shift._id}`}
            sx={{
                display: "flex",
                alignItems: "stretch",
                flexDirection: { lg: cardDirection },
                '&:hover': { cursor: "pointer" }
            }}
            onClick={handleOpenShift}>
            <CardActionArea onClick={handleOpenShift}>
                <CardContent sx={{
                    alignItems: "center",
                    pb: cardDirection === "column" ? { lg: 0.5 } : null
                }}>
                    <Stack direction="row">
                        <EventNoteIcon sx={{ mr: "0.5rem", color: theme.palette.primary.dark }} />
                        <Typography variant="body1" className="shift-date" fontWeight="bold"
                            color={theme.palette.primary.dark}>
                            {shift ? new Date(shift.shiftStartTime)
                                .toLocaleDateString("en-AU", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                })
                                : "Could not load shift time"}
                        </Typography>
                    </Stack>
                    <Box mt={1}>
                        <Typography variant="body1" className="shift-time">
                            {shift ? `${new Date(shift.shiftStartTime)
                                .toLocaleTimeString("en-AU", { timeStyle: "short" })} 
                                – ${new Date(shift.shiftEndTime)
                                    .toLocaleTimeString("en-AU", { timeStyle: "short" })}`
                                : null}
                        </Typography>
                        <Typography variant="body1" className="shift-carer">
                            Carer: {shift.carer.firstName} {shift.carer.lastName}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
            {/* Show shift buttons only on larger screen sizes */}
            <CardActions sx={{
                justifyContent: { xs: "flex-end", lg: "flex-start" },
                [theme.breakpoints.down("sm")]: { maxWidth: "7rem" }
            }}>
                <Stack direction="row" gap={1} className="shift-buttons"
                    sx={{
                        [theme.breakpoints.down("sm")]: { flexWrap: "wrap", justifyContent: "center" }
                    }}>
                    <Tooltip title="Coordinator Notes">
                        <IconButton className="shift-button-coordinator-notes" data-testid="coordinator-notes"
                            onClick={(event) => handleOpenShift(event, "coordinator-notes")}
                            size="small"
                            sx={{
                                color: shift.coordinatorNotes ?
                                    theme.palette.primary.main : "inital"
                            }}>
                            <AssignmentIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Shift Notes">
                        <IconButton className="shift-button-shift-notes" data-testid="notes"
                            onClick={(event) => handleOpenShift(event, "shift-notes")}
                            size="small"
                            sx={{
                                color: shift.shiftNotes?.shiftNotesText ?
                                    theme.palette.primary.main : "inital"
                            }}>
                            <DescriptionIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Handover">
                        <IconButton className="shift-button-handover" data-testid="handover"
                            onClick={(event) => handleOpenShift(event, "handover-notes")}
                            size="small"
                            sx={{
                                color: shift.handoverNotes ?
                                    theme.palette.primary.main : "inital"
                            }}>
                            <ForumRoundedIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Incident Reports">
                        <IconButton className="shift-button-incidents" data-testid="incidents"
                            onClick={(event) => handleOpenShift(event, "incident-reports")}
                            size="small"
                            sx={{
                                color: shift.incidentReports?.length > 0 ?
                                    theme.palette.error.main : "inital"
                            }}>
                            <ReportRoundedIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </CardActions>
        </Card>
    );
}

export default Shift