import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { ButtonPrimary } from "../root/Buttons";

import {
    useTheme, Grid, Box, Typography,
    Avatar, Card, CardContent, CardActionArea,
    List, ListItem, ListItemAvatar, ListItemText
} from "@mui/material"
import EditIcon from '@mui/icons-material/Edit';
import ReportIcon from '@mui/icons-material/Report';
import ForumIcon from '@mui/icons-material/Forum';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';

const Overview = (props) => {
    const { store } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const theme = useTheme();
    const navigate = useNavigate();
    const { shiftUtils } = props;

    const viewPanel = useCallback((panel) => {
        modalDispatch({
            type: "setActiveDrawer",
            data: panel
        });
    }, [modalDispatch]);

    const editShift = useCallback(() => {
        modalDispatch({
            type: "setActiveModal",
            data: {
                title: "Edit your shift",
                text: `You can make changes to your shift start and end times, assigned carer,
                and coordinator notes before the shift start time.`
            }
        });
        modalDispatch({
            type: "open",
            data: "modal"
        });
        navigate("/calendar/edit-shift")
    }, [modalDispatch, navigate]);

    const openCareTeamList = useCallback(() => {
        navigate("/calendar/care-team");
        modalDispatch({
            type: "open",
            data: "modal"
        });
    }, [modalDispatch, navigate]);

    const renderContent = (card) => {
        switch (card) {
            case "shift notes":
                if (store.selectedShift.shiftNotes) {
                    return (
                        <Typography variant="body1">
                            {store.selectedShift.shiftNotes.shiftNotesText}
                        </Typography>
                    );
                } break;
            case "incident reports":
                if (store.selectedShift.incidentReports.length > 0) {
                    return (
                        <Typography variant="body1">
                            {store.selectedShift.incidentReports[0].incidentReportText}
                        </Typography>
                    );
                } break;
            case "handover":
                if (store.selectedShift.handoverNotes) {
                    return (
                        <Typography variant="body1">
                            {store.selectedShift.handoverNotes}
                        </Typography>
                    );
                } break;
            default: break;
        }
        if (shiftUtils.userIsCarer
            && (shiftUtils.isInProgress || shiftUtils.isInEditWindow)
            && (shiftUtils.isPenultimateShift || shiftUtils.isLastShift)) {
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
                case "incident reports": content = "There are no incident reports for this shift"; break;
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

    return (
        <Grid container rowSpacing={2} columnSpacing={2}>
            {store.selectedShift.coordinatorNotes ? (
                <Grid item xs={12}>
                    <Card variant="outlined" sx={{
                        backgroundColor: theme.palette.primary.light,
                        border: "none", position: "relative"
                    }}>
                        <CardContent>
                            <>
                                <AssignmentIcon sx={{
                                    position: "absolute",
                                    right: "0.5rem", top: "0.5rem",
                                    color: theme.palette.primary.main
                                }} />
                                <Typography variant="h6" component="p" color={theme.palette.primary.dark}>
                                    Notes from Coordinator
                                </Typography>
                                <Typography variant="body1">
                                    {store.selectedShift.coordinatorNotes}
                                </Typography>
                            </>
                        </CardContent>
                    </Card>
                </Grid>) : null
            }
            {shiftUtils.prevShift && Boolean(shiftUtils.prevShift.handoverNotes) ? (
                <Grid item xs={12}>
                    <Card variant="outlined" sx={{
                        backgroundColor: theme.palette.grey[200],
                        border: "none", position: "relative"
                    }}>
                        <CardContent>
                            <>
                                <ForumIcon sx={{ position: "absolute", right: "0.5rem", top: "0.5rem", color: "grey" }} />
                                <Typography variant="h6" component="p">
                                    Handover from previous shift
                                </Typography>
                                <Typography variant="body1">
                                    {shiftUtils.prevShift.handoverNotes}
                                </Typography>
                            </>
                        </CardContent>
                    </Card>
                </Grid>) : null
            }
            <Grid item xs={12}>
                <Card variant="outlined" id="shift-notes-card">
                    <CardActionArea onClick={() => viewPanel("shift notes")}>
                        <CardContent>
                            <EditIcon sx={{ position: "absolute", right: "0.5rem", top: "0.5rem" }} />
                            <Typography variant="h5" component="p">Shift Notes</Typography>
                            {renderContent("shift notes")}
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>

            <Grid item xs={12} md={6} display={"flex"}>
                <Card variant="outlined" id="incidents-card" sx={{ flexGrow: 1 }}>
                    <CardActionArea onClick={() => viewPanel("incident reports")} sx={{ height: "100%", display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <ReportIcon sx={{ position: "absolute", right: "0.5rem", top: "0.5rem" }} />
                            <Typography variant="h5" component="p">Incidents {store.selectedShift.incidentReports.length > 0 ? `(${store.selectedShift.incidentReports.length})` : null}</Typography>
                            {renderContent("incident reports")}
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>

            <Grid item xs={12} md={6} display={"flex"}>
                <Card variant="outlined" id="handover-card" sx={{ flexGrow: 1 }}>
                    <CardActionArea onClick={() => viewPanel("handover notes")} sx={{ height: "100%", display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <ForumIcon sx={{ position: "absolute", right: "0.5rem", top: "0.5rem" }} />
                            <Typography variant="h5" component="p">Handover</Typography>
                            {renderContent("handover")}
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card variant="outlined" id="care-team-card">
                    <CardActionArea onClick={openCareTeamList}>
                        <CardContent>
                            <Diversity3Icon sx={{ position: "absolute", right: "0.5rem", top: "0.5rem" }} />
                            <Typography variant="h5" component="p">Shift Carers</Typography>
                            <List dense>
                                {[1].map(item => {
                                    return (
                                        <ListItem key={item}>
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

            <Grid item xs={12}>
                <Card variant="outlined">
                    <CardContent>
                        {Object.keys(shiftUtils).length > 0 && process.env.NODE_ENV === 'development' ? (
                            <>
                                userIsCarer: {shiftUtils.userIsCarer.toString()}<br></br>
                                isLastShift: {shiftUtils.isLastShift.toString()}<br></br>
                                isPenultimateShift: {shiftUtils.isPenultimateShift.toString()}<br></br>
                                isPending: {shiftUtils.isPending.toString()}<br></br>
                                isInProgress: {shiftUtils.isInProgress.toString()}<br></br>
                                hasEnded: {shiftUtils.hasEnded.toString()}<br></br>
                                isInEditWindow: {shiftUtils.isInEditWindow.toString()}<br></br>
                                nextShiftHasStarted: {shiftUtils.nextShiftHasStarted.toString()}
                            </>
                        ) : null
                        }
                    </CardContent>
                </Card>
            </Grid>

            {/* The shift is editable if the user is the coordinator
            and the shift is in the future or in progress */}
            {store.selectedShift.coordinator === store.user._id
                && (new Date(store.selectedShift.shiftStartTime) > new Date()
                    || new Date(store.selectedShift.shiftEndTime) > new Date()) ? (
                <Grid item xs={12} sx={{ gridArea: "auto / 1 / auto / span 2 " }}>
                    <ButtonPrimary onClick={editShift}>
                        Edit shift
                    </ButtonPrimary>
                </Grid>
            ) : null
            }
        </Grid>
    )
};

export default Overview