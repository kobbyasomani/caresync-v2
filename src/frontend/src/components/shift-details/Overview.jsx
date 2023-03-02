import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";

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

const Overview = () => {
    const { store } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const theme = useTheme();

    const viewPanel = (panel) => {
        modalDispatch({
            type: "setActiveDrawer",
            data: panel
        });
    }

    return (
        <Grid display="grid"
            sx={{
                gridTemplate: "repeat(4, auto) / repeat(2, 1fr)",
                alignItems: "stretch",
                gap: 2,
            }}>
            <Grid item xs={12} sx={{ gridArea: "1 / 1 / span 1 / span 2" }}>
                <Card variant="outlined" sx={{ backgroundColor: theme.palette.grey[200], border: "none" }}>
                    <CardContent>
                        {store.selectedShift.coordinatorNotes ? (
                            <>
                                <Typography variant="h6" component="p">
                                    Notes from Coordinator
                                </Typography>
                                <Typography variant="body1">
                                    {store.selectedShift.coordinatorNotes}
                                </Typography>
                            </>
                        ) : (
                            null
                        )}
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sx={{ gridArea: "2 / 1 / span 1 / span 2" }}>
                <Card variant="outlined" id="shift-notes-card">
                    <CardActionArea onClick={() => viewPanel("shift notes")}>
                        <CardContent>
                            <EditIcon sx={{ position: "absolute", right: "0.5rem", top: "0.5rem" }} />
                            <Typography variant="h5" component="p">Shift Notes</Typography>
                            {store.selectedShift.shiftNotes ? (
                                <Typography variant="body1">
                                    {store.selectedShift.shiftNotes.shiftNotesText}
                                </Typography>
                            ) : store.user._id === store.selectedShift.carer._id ? (
                                <Typography variant="body1" color={theme.palette.primary.main}>
                                    Enter your shift notes
                                </Typography>
                            ) : (
                                <Typography variant="body1">
                                    There are no shift notes for this shift.
                                </Typography>
                            )}
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>

            <Grid item xs={6} sx={{ gridArea: "3 / 1 / span 1 / span 1" }}>
                <Card variant="outlined" id="incidents-card">
                    <CardActionArea onClick={() => viewPanel("incidents")}>
                        <CardContent>
                            <ReportIcon sx={{ position: "absolute", right: "0.5rem", top: "0.5rem" }} />
                            <Typography variant="h5" component="p">Incidents</Typography>
                            <Typography variant="body1">Incident snippet goes here.
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>

            <Grid item xs={6} sx={{ gridArea: "3 / 2 / span 1 / span 1", display: "flex" }}>
                <Card variant="outlined" id="handover-card" sx={{ flexGrow: 1 }}>
                    <CardActionArea onClick={() => viewPanel("handover notes")} sx={{ height: "100%", display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <ForumIcon sx={{ position: "absolute", right: "0.5rem", top: "0.5rem" }} />
                            <Typography variant="h5" component="p">Handover</Typography>
                            {store.selectedShift.handoverNotes ? (
                                store.selectedShift.handoverNotes
                            ) : store.user._id === store.selectedShift.carer._id ? (
                                <Box sx={{ display: "flex" }}>

                                    <Typography variant="body1" color={theme.palette.primary.main}>
                                        Add handover
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography variant="body1">
                                    There are no handover notes for this shift.
                                </Typography>
                            )}
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>

            <Grid item xs={12} sx={{ gridArea: "4 / 1 / span 2 / span 2" }}>
                <Card variant="outlined" id="care-team-card">
                    <CardActionArea onClick={() => viewPanel("")}>
                        <CardContent>
                            <Diversity3Icon sx={{ position: "absolute", right: "0.5rem", top: "0.5rem" }} />
                            <Typography variant="h5" component="p">Care Team</Typography>
                            <List dense>
                                {[1].map(item => {
                                    return (
                                        <ListItem key={item}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ width: "2rem", height: "2rem" }}>
                                                    <PersonIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
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
        </Grid>
    )
};

export default Overview