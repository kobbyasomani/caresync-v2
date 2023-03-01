import { useCallback } from "react";
import { useGlobalContext } from "../utils/globalUtils";
import { useModalContext } from "../utils/modalUtils";
import { dateAsObj } from "../utils/dateUtils";

import PersonIcon from '@mui/icons-material/Person';
import {
    Box, Stack, Drawer, Typography,
    Card, CardContent, CardActionArea,
    List, ListItem, ListItemAvatar, ListItemText, Avatar,
    Grid, IconButton, useTheme
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ReportIcon from '@mui/icons-material/Report';
import ForumIcon from '@mui/icons-material/Forum';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import CloseIcon from '@mui/icons-material/Close';

const ShiftDetails = () => {
    const { store } = useGlobalContext();
    const { modalStore, modalDispatch } = useModalContext();
    const theme = useTheme();

    const shift = store.selectedShift;
    const patient = store.selectedPatient;
    const carer = shift.carer;
    const shiftStart = dateAsObj(shift.shiftStartTime);
    const shiftEnd = dateAsObj(shift.shiftEndTime);

    // Sets width of the drawer content column
    const drawerWidth = "100%";
    const closeDrawer = useCallback((event) => {
        // Prevent tab/shift keypresses while drawer is open from closing it
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        modalDispatch({
            type: "close",
            data: "drawer"
        });
    }, [modalDispatch]);

    const content = () => (
        <Box
            sx={{ drawerWidth, p: 2 }}
            role="presentation"
            onKeyDown={closeDrawer}
        >
            <IconButton className="close-modal"
                onClick={closeDrawer}
                sx={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}>
                <CloseIcon />
            </IconButton>

            <Grid container rowSpacing={2} columnSpacing={2} alignItems="center" sx={{ pt: 1 }}>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={1}>
                        <PersonIcon fontSize="medium" sx={{ color: theme.palette.primary.main }} />
                        <Typography variant="h5" component="p" color={theme.palette.primary.main}>
                            {patient.firstName} {patient.lastName}
                        </Typography>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h2" component="p">
                        Shift on {shift ? (
                            shiftStart.toLocaleDateString("en-AU", { dateStyle: "long" })
                        ) : "D MONTH YEAR"
                        }
                    </Typography>
                    <Typography variant="h3" component="p">
                        {shift ? (
                            `${shiftStart.toLocaleTimeString("en-AU", { timeStyle: "short" })} – 
                            ${shiftEnd.toLocaleTimeString("en-AU", { timeStyle: "short" })}`
                        ) : "00:00 – 00:00"}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Card variant="outlined" id="shift-notes-card">
                        <CardActionArea>
                            <CardContent>
                                <EditIcon sx={{ position: "absolute", right: "0.5rem", top: "0.5rem" }} />
                                <Typography variant="h5" component="p">Shift Notes</Typography>
                                <Typography variant="body1">Shift note snippet goes here.
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                    Accusamus similique labore neque veniam, atque magni non
                                    qui tempore quod...
                                </Typography>
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
        </Box>
    );

    return (
        <div>
            <>
                <Drawer
                    // variant="persistent"
                    anchor="right"
                    open={modalStore.drawerIsOpen}
                    onClose={closeDrawer}
                >
                    {content()}
                </Drawer>
            </>
        </div>
    )
}

export default ShiftDetails;