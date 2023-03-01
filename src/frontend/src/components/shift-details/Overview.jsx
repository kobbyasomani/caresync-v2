import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";

import {
    useTheme, Grid, Typography,
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
    const carer = store.selectedShift.carer;

    const viewShiftNotes = () => {
        modalDispatch({
            type: "setActiveDrawer",
            data: "shift notes"
        })
    }

    return (
        <Grid container rowSpacing={2} columnSpacing={2} alignItems="center">
            <Grid item xs={12}>
                <Card variant="outlined" sx={{ backgroundColor: theme.palette.grey[200], border: "none"}}>
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
            <Grid item xs={12}>
                <Card variant="outlined" id="shift-notes-card">
                    <CardActionArea onClick={viewShiftNotes}>
                        <CardContent>
                            <EditIcon sx={{ position: "absolute", right: "0.5rem", top: "0.5rem" }} />
                            <Typography variant="h5" component="p">Shift Notes</Typography>

                            {store.selectedShift.shiftNotes ? (
                                <Typography variant="body1">
                                    {store.selectedShift.shiftNotes}
                                </Typography>
                            ) : (
                                <Typography variant="body1" color={theme.palette.primary.main}>
                                    Enter your shift notes here
                                </Typography>
                            )}
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>

            <Grid item xs={6}>
                <Card variant="outlined" id="incidents-card">
                    <CardActionArea>
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

            <Grid item xs={6}>
                <Card variant="outlined" id="handover-card">
                    <CardActionArea>
                        <CardContent>
                            <ForumIcon sx={{ position: "absolute", right: "0.5rem", top: "0.5rem" }} />
                            <Typography variant="h5" component="p">Handover</Typography>
                            <Typography variant="body1">Incident snippet goes here.
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card variant="outlined" id="care-team-card">
                    <CardActionArea>
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
                                                primary={carer ? `${carer.firstName} ${carer.lastName}` : "Firstname Lastname"}
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