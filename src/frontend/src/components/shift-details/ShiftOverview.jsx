import React, { useCallback } from "react";
import { useNavigate, Outlet } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { ButtonPrimary, ButtonSecondary } from "../root/Buttons";

import {
    useTheme, Grid, Box, Typography, Stack, Divider, Tooltip,
    Avatar, Card, CardContent, CardActionArea, CardActions,
    List, ListItem, ListItemAvatar, ListItemText, ListItemButton,
} from "@mui/material"
import DescriptionIcon from '@mui/icons-material/Description';
import ReportRoundedIcon from '@mui/icons-material/ReportRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EditCalendarRoundedIcon from '@mui/icons-material/EditCalendarRounded';

const ShiftOverview = () => {
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const { shiftUtils } = store;

    const theme = useTheme();
    const navigate = useNavigate();

    const handleViewPanel = useCallback((panel) => {
        navigate(`/calendar/shift-details/${panel}`)
    }, [navigate]);

    const handleEditShift = useCallback(() => {
        modalDispatch({
            type: "open",
            data: "modal",
            id: "edit-shift"
        });
    }, [modalDispatch]);

    const handleOpenCareTeamList = useCallback(() => {
        modalDispatch({
            type: "open",
            data: "modal",
            id: "care-team-list"
        });
    }, [modalDispatch]);

    const handleConfirmCancelShift = useCallback(() => {
        modalDispatch({
            type: "open",
            data: "confirmation",
            id: `confirmCancelShift_${store.selectedShift._id}`
        });
    }, [modalDispatch, store.selectedShift._id]);

    const openIncident = useCallback((incident) => {
        dispatch({
            type: "setSelectedIncidentReport",
            data: incident
        });
        navigate(`/calendar/shift-details/incident-reports/${incident._id}`);
    }, [dispatch, navigate]);

    const renderContent = (card) => {
        if (shiftUtils.isPending) {
            return (
                <Typography variant="body1" sx={{ color: theme.palette.grey[500] }}>
                    Pending
                </Typography>
            );
        }
        switch (card) {
            case "shift notes":
                if (store.selectedShift.shiftNotes) {
                    return (
                        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                            {store.selectedShift.shiftNotes.shiftNotesText.length <= 520 ?
                                store.selectedShift.shiftNotes.shiftNotesText
                                : <>
                                    {store.selectedShift.shiftNotes.shiftNotesText.slice(0, 520)}
                                    ... <span style={{ color: theme.palette.primary.main }}>
                                        Read more
                                    </span>
                                </>
                            }
                        </Typography>
                    );
                } break;
            case "incident reports":
                if (store.selectedShift.incidentReports.length > 0) {
                    return (
                        <List gap={2} sx={{ py: 0, width: "100%" }}>
                            {store.selectedShift.incidentReports.slice(0, 3).map((report, index) => {
                                return (
                                    <React.Fragment key={`${report._id}_listItem`}>
                                        <ListItem sx={{ px: 0, py: 0.5 }}>
                                            <ListItemButton
                                                sx={{ borderRadius: 1, px: 1 }}
                                                onClick={() => openIncident(report)}
                                            >
                                                <Typography variant="body1">
                                                    {report.incidentReportText.length <= 100 ?
                                                        report.incidentReportText
                                                        : report.incidentReportText.slice(0, 100)}...

                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        {index < store.selectedShift.incidentReports.length - 1
                                            || store.selectedShift.incidentReports.length > 3 ?
                                            <Divider key={`${report._id}_divider`} />
                                            : null
                                        }
                                    </React.Fragment>
                                );
                            })}
                            {store.selectedShift.incidentReports.length > 3 ?
                                <ListItem key="moreIncidentReports" sx={{ px: 0, py: 0.5 }}>
                                    <ListItemButton
                                        sx={{ borderRadius: 1, px: 1 }}
                                        onClick={() => handleViewPanel("incident-reports")}
                                    >
                                        <Typography variant="body1" color={theme.palette.primary.main}>
                                            And {store.selectedShift.incidentReports.length - 3} more...
                                        </Typography>
                                    </ListItemButton>
                                </ListItem>
                                : null
                            }
                        </List>
                    );
                } break;
            case "handover":
                if (store.selectedShift.handoverNotes) {
                    return (
                        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                            {store.selectedShift.handoverNotes.length <= 350 && store.selectedShift.incidentReports.length <= 3 ?
                                store.selectedShift.handoverNotes
                                : store.selectedShift.incidentReports.length > 3 ? (
                                    <>
                                        {store.selectedShift.handoverNotes.slice(0, 450)}
                                        ... <span style={{ color: theme.palette.primary.main }}>
                                            Read more
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        {store.selectedShift.handoverNotes.slice(0, 350)}
                                        ... <span style={{ color: theme.palette.primary.main }}>
                                            Read more
                                        </span>
                                    </>
                                )
                            }
                        </Typography >
                    );
                } break;
            default: break;
        }
        if (shiftUtils.userIsShiftCarer
            && (shiftUtils.isInProgress || shiftUtils.isInEditWindow)) {
            let content;
            switch (card) {
                case "shift notes": content = "Enter your shift notes"; break;
                case "incident reports": content = "Create an incident report"; break;
                case "handover": content = "Add handover"; break;
                default: content = `Add ${card}`; break;
            }
            return (
                <Box sx={{ display: "flex" }}>
                    <Typography variant="body1" color={theme.palette.primary.main}>
                        {content}
                    </Typography>
                </Box>
            );
        } else {
            let content;
            switch (card) {
                case "shift notes": content = "There are no shift notes for this shift"; break;
                case "incident reports": content = "There are no incidents for this shift"; break;
                case "handover": content = "There is no handover for this shift"; break;
                default: content = `There is no ${card} for this shift`; break;
            }
            return (
                <Box sx={{ display: "flex" }}>
                    <Typography variant="body1" >
                        {content}
                    </Typography >
                </Box>
            );
        }
    }

    return store.selectedShift?._id && shiftUtils?._id ? (
        <>
            <Grid container rowSpacing={2} columnSpacing={2}>
                {store.selectedShift.coordinatorNotes ? (
                    <Grid item xs={12}>
                        <Card variant="outlined" sx={{
                            backgroundColor: theme.palette.primary.light,
                            border: "none", position: "relative"
                        }}>
                            <CardActionArea onClick={() => handleViewPanel("coordinator-notes")}>
                                <CardContent>
                                    <AssignmentIcon sx={{
                                        position: "absolute",
                                        right: "0.5rem", top: "0.5rem",
                                        color: theme.palette.primary.main
                                    }} />
                                    <Typography variant="h6" component="h3" color={theme.palette.primary.dark}>
                                        Notes from Coordinator
                                    </Typography>
                                    <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                                        {store.selectedShift.coordinatorNotes.length <= 300 ?
                                            store.selectedShift.coordinatorNotes
                                            : <>
                                                {store.selectedShift.coordinatorNotes.slice(0, 300)}
                                                ... <span style={{ color: theme.palette.primary.main }}>
                                                    Read more
                                                </span>
                                            </>
                                        }
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>) : null
                }
                {shiftUtils.prevShift && shiftUtils.prevShift.handoverNotes ? (
                    <Grid item xs={12}>
                        <Card variant="outlined" sx={{
                            backgroundColor: theme.palette.grey[200],
                            border: "none", position: "relative"
                        }}>
                            <CardActionArea onClick={() => handleViewPanel("prev-shift-handover")}>
                                <CardContent>
                                    <ForumRoundedIcon sx={{ position: "absolute", right: "0.5rem", top: "0.5rem", color: "grey" }} />
                                    <Typography variant="h6" component="h3">
                                        Handover from previous shift
                                    </Typography>
                                    <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                                        {shiftUtils.prevShift.handoverNotes.length <= 300 ?
                                            shiftUtils.prevShift.handoverNotes
                                            : <>
                                                {shiftUtils.prevShift.handoverNotes.slice(0, 300)}
                                                ... <span style={{ color: theme.palette.primary.main }}>
                                                    Read more
                                                </span>
                                            </>
                                        }
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>) : null
                }
                <Grid item xs={12}>
                    <Card variant="outlined" id="shift-notes-card">
                        <CardActionArea onClick={() => handleViewPanel("shift-notes")}>
                            <CardContent>
                                <DescriptionIcon sx={{
                                    position: "absolute", right: "0.5rem", top: "0.5rem",
                                    color: store.selectedShift.shiftNotes?.shiftNotesText ?
                                        theme.palette.primary.main : theme.palette.grey[500]
                                }} />
                                <Typography variant="h5" component="h3">Shift Notes</Typography>
                                {renderContent("shift notes")}
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card variant="outlined" id="incidents-card" sx={{ height: "100%" }}>
                        <Tooltip title="View all incidents" placement="top" arrow>
                            <CardActionArea onClick={() => handleViewPanel("incident-reports")}>
                                <CardContent>
                                    <ReportRoundedIcon sx={{
                                        position: "absolute", right: "0.5rem", top: "0.5rem",
                                        color: store.selectedShift.incidentReports.length > 0 ?
                                            theme.palette.error.main : theme.palette.grey[500]
                                    }} />
                                    <Typography variant="h5" component="h3">
                                        Incidents {store.selectedShift.incidentReports.length > 0 ?
                                            `(${store.selectedShift.incidentReports.length})`
                                            : null}
                                    </Typography>
                                    {store.selectedShift.incidentReports.length === 0 ?
                                        renderContent("incident reports")
                                        : null
                                    }
                                </CardContent>
                            </CardActionArea>
                        </Tooltip>
                        {store.selectedShift.incidentReports.length > 0 ?
                            <CardActions sx={{ pt: 0 }}>
                                {renderContent("incident reports")}
                            </CardActions>
                            : null
                        }
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card variant="outlined" id="handover-card" sx={{ height: "100%" }}>
                        <CardActionArea onClick={() => handleViewPanel("handover-notes")}>
                            <CardContent>
                                <ForumRoundedIcon sx={{
                                    position: "absolute", right: "0.5rem", top: "0.5rem",
                                    color: store.selectedShift.handoverNotes ?
                                        theme.palette.primary.main : theme.palette.grey[500]
                                }} />
                                <Typography variant="h5" component="h3">Handover</Typography>
                                {renderContent("handover")}
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card variant="outlined" id="care-team-card">
                        <CardActionArea onClick={handleOpenCareTeamList}>
                            <CardContent>
                                <Diversity3Icon sx={{
                                    position: "absolute", right: "0.5rem", top: "0.5rem",
                                    color: theme.palette.primary.main
                                }} />
                                <Typography variant="h5" component="h3">Shift Carer</Typography>
                                <List dense>
                                    {[1,].map(item => {
                                        return (
                                            <ListItem key={`carer_${item}`}>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ width: "2rem", height: "2rem", backgroundColor: theme.palette.primary.main }}>
                                                        <PersonIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primaryTypographyProps={{ fontSize: theme.typography.htmlFontSize }}
                                                    primary={Object.keys(store.selectedShift.carer).length > 0 ? `${store.selectedShift.carer.firstName} ${store.selectedShift.carer.lastName}` : "Firstname Lastname"}
                                                    secondary="(+61) 123 456 789"
                                                />
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>

                {/* ShiftUtils display */}
                {/* <Grid item xs={12}>
                <Card variant="outlined">
                    <CardContent>
                        {Object.keys(shiftUtils).length > 0 && process.env.NODE_ENV === 'development' ? (
                            <>
                                userIsShiftCarer: {shiftUtils.userIsShiftCarer.toString()}<br></br>
                                isLastShift: {shiftUtils.isLastShift.toString()}<br></br>
                                isPenultimateShift: {shiftUtils.isPenultimateShift.toString()}<br></br>
                                isPending: {shiftUtils.isPending.toString()}<br></br>
                                isInProgress: {shiftUtils.isInProgress.toString()}<br></br>
                                hasEnded: {shiftUtils.hasEnded.toString()}<br></br>
                                isInEditWindow: {shiftUtils.isInEditWindow.toString()}<br></br>
                                prevShift: {shiftUtils.prevShift ? new Date(shiftUtils.prevShift?.shiftStartTime).toLocaleString() : "null"}<br></br>
                                nextShift: {shiftUtils.nextShift ? new Date(shiftUtils.nextShift?.shiftStartTime).toLocaleString() : "null"}<br></br>
                                nextShiftHasStarted: {shiftUtils.nextShiftHasStarted.toString()}
                            </>
                        ) : null
                        }
                    </CardContent>
                </Card>
            </Grid> */}

                {/* The shift is editable if the user is the coordinator
                and the shift is pending or in progress. */}
                <Grid item xs={12} sx={{ gridArea: "auto / 1 / auto / span 2 " }}>
                    <Stack direction="row" gap={2} justifyContent="center">
                        {shiftUtils.isPending || shiftUtils.isInProgress ?
                            <ButtonPrimary onClick={handleEditShift} sx={{ margin: "0" }}
                                startIcon={<EditCalendarRoundedIcon />}>
                                Edit Shift
                            </ButtonPrimary>
                            : null}
                        {shiftUtils.isPending || shiftUtils.isSample ?
                            <ButtonSecondary onClick={handleConfirmCancelShift}
                                sx={{ margin: "0" }} startIcon={<EventBusyIcon />}>
                                Cancel shift
                            </ButtonSecondary>
                            : null}
                    </Stack>
                </Grid>
            </Grid>
            <Outlet />
        </>
    ) : (
        <Typography variant="body1">
            Unable to load shift details.
            {shiftUtils?._id}
        </Typography>
    )
};

export default ShiftOverview