import { useEffect, useState, useCallback } from "react";
import { Outlet, useNavigate, Navigate } from "react-router-dom";

import { useGlobalContext } from "../utils/globalUtils";
import { useModalContext } from "../utils/modalUtils";
import SelectClient from "../components/SelectClient";
import { getAllShifts } from "../utils/apiUtils";
import Shift from "../components/Shift";
import CalendarDayGrid from "../components/CalendarDayGrid";
import Modal from "../components/Modal";
import ShiftDetails from "../components/shift-details/ShiftDetails";
import Loader from "../components/logo/Loader";
import { getCarers } from "../utils/apiUtils";
import { ButtonAddShift } from "../components/root/Buttons";

import {
    Typography, Stack, Box, IconButton, Tooltip,
    Avatar, useTheme, Card, CardActionArea, CardContent
} from "@mui/material"
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PersonIcon from '@mui/icons-material/Person';

export const Calendar = () => {
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const [isLoading, setIsLoading] = useState(true);
    const [carers, setCarers] = useState([]);
    const theme = useTheme();
    const navigate = useNavigate();
    const userIsCoordinator = (userId) => {
        return userId === store.selectedClient.coordinator;
    };

    // Fetch all client shifts and add them to state
    useEffect(() => {
        getAllShifts(store.selectedClient._id)
            .then((shifts) => {
                // console.log(shifts);
                dispatch({
                    type: "setShifts",
                    data: shifts
                });
                setIsLoading(false);
            });
    }, [store.selectedClient, dispatch]);

    // Set the featured shift (closest upcoming)
    useEffect(() => {
        if (Object.keys(store.shifts).length === 0) {
            return
        }
        const findUpcomingShift = () => {
            // console.log("Finding upcoming shift...");
            let upcomingShift = null;
            // console.log(`shifts: `, shifts);
            for (const shift of store.shifts) {
                const shiftDate = new Date(shift.shiftStartTime);
                // console.log("shift date: ", shiftDate);
                const now = new Date();
                // console.log("date now: ", now);
                if (shiftDate > now && upcomingShift === null) {
                    // console.log(`${shiftDate} added as featured shift`);
                    upcomingShift = shift;
                }
                if (shiftDate > now && shiftDate < upcomingShift) {
                    // console.log(`${shiftDate} added as featured shift`);
                    upcomingShift = shift;
                }
            }
            if (upcomingShift) {
                // console.log(`upcoming shift: ${upcomingShift.shiftStartTime}`);
                return upcomingShift;
            } else {
                // console.log("No upcoming shift found");
                return {};
            }
        }
        const featuredShift = findUpcomingShift();
        dispatch({
            type: "setFeaturedShift",
            data: featuredShift
        });
    }, [store.shifts, store.selectedClient, dispatch]);

    // Set the previous shifts (previous two shifts before today)
    useEffect(() => {
        if (Object.keys(store.shifts).length === 0) {
            return
        }
        const findPreviousShifts = () => {
            // console.log("Finding previous shifts...");
            let shifts = [...store.shifts];
            if (shifts.length > 1) {
                shifts = [...store.shifts].reverse();
            }
            let prevShifts = [];
            // console.log(`shifts: `, shifts);
            for (let i = 0; i < shifts.length; i++) {
                const shift = shifts[i];
                // console.log(`shift: `, shift);
                const shiftDate = new Date(shift.shiftStartTime);
                // console.log("shift date: ", shiftDate);
                const now = new Date();
                // console.log("date now: ", now);
                if (shiftDate < now) {
                    // console.log(`${shiftDate} added to prevShifts`);
                    prevShifts.push(shift)
                }
            }
            if (prevShifts.length > 0) {
                // console.log("prevShifts: ", prevShifts);
                return prevShifts;
            } else {
                // console.log("No previous shifts found");
                return [];
            }
        }
        const prevShifts = findPreviousShifts();
        dispatch({
            type: "setPreviousShifts",
            data: prevShifts
        });
    }, [store.shifts, store.selectedClient, dispatch]);
    // console.log(store.featuredShift.shiftStartTime);

    const openCareTeamList = useCallback(() => {
        navigate("/calendar/care-team");
        modalDispatch({
            type: "open",
            data: "modal"
        });
    }, [modalDispatch, navigate]);

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
    }, [dispatch, modalDispatch, store]);

    // Get the list of carers for selelcted client and set them in state
    useEffect(() => {
        getCarers(store.selectedClient._id).then(carers => {
            setCarers(carers);
        });
    }, [store.selectedClient]);

    return isLoading ? <Loader /> : (
        store.selectedClient && store.shifts ? (
            <Box display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gap={2}
            >

                <Box sx={{ mt: { lg: "1rem" } }}
                    gridArea={{
                        xs: "1 / 1 / span 1 / span 12",
                        lg: "auto / 1 / span 1 / span 3"
                    }}>
                    <Stack direction="row" alignItems="center" gap={2}>
                        <SelectClient />
                        <Tooltip title="Care Team" placement="left">
                            <IconButton color="primary" size="large"
                                sx={{
                                    ml: "auto", backgroundColor: "#eef1f6ff",
                                    display: { lg: "none" }
                                }}
                                variant="contained"
                                id="care-team-button"
                                onClick={openCareTeamList}
                            >
                                <Diversity3Icon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>

                <Box id="careTeam"
                    gridArea={{
                        xs: "2 / 1 / span 1 / span 12",
                        lg: "auto / 1 / span 1 / span 3"
                    }}
                    sx={{ display: { xs: "none", lg: "initial" }, mt: "auto" }}>
                    <section style={{ mt: 0 }}>
                        <Card variant="outlined">
                            <CardActionArea onClick={openCareTeamList}>
                                <CardContent>
                                    <Typography variant="h3" mb={1}>
                                        Care Team
                                    </Typography>
                                    <Stack gap={1}>
                                        {carers.map(carer => {
                                            return (
                                                <Stack direction="row" gap={1} key={carer._id}>
                                                    <Avatar sx={{
                                                        width: "1.5rem", height: "1.5rem",
                                                        backgroundColor: theme.palette.primary.main
                                                    }}>
                                                        <PersonIcon fontSize="small" />
                                                    </Avatar>
                                                    <Typography variant="body1">
                                                        {carer.firstName} {carer.lastName}
                                                        {userIsCoordinator(carer._id) ? <small> (coordinator)</small> : null}
                                                    </Typography>
                                                </Stack>
                                            )
                                        })}
                                    </Stack>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </section>
                </Box>

                <Box id="upcomingShift"
                    gridArea={{
                        xs: "3 / 1 / span 1 / span 12",
                        lg: "auto / 1 / span 1 / span 3"
                    }}
                    sx={{
                        bgcolor: theme.palette.primary.light,
                        borderRadius: "0.25rem",
                        padding: 2,
                        mb: { xs: "1rem", lg: 0 },
                        position: "relative",
                    }}>
                    {Object.keys(store.featuredShift).length > 0 ? (
                        <section>
                            <Typography variant="h3" sx={{ mb: 1 }}>
                                Upcoming Shift
                            </Typography>
                            <Shift featured shift={store.featuredShift} />
                            <ButtonAddShift variant={{ xs: "full", xl: "icon-only" }} />
                        </section>
                    ) : (
                        <section>
                            <Typography variant="h3">
                                No upcoming shift
                            </Typography>
                            <ButtonAddShift />
                        </section>
                    )}
                </Box>

                <Box id="recentShifts"
                    gridArea={{
                        xs: "4 / 1 / span 1 / span 12",
                        lg: "auto / 1 / span 1 / span 3"
                    }}
                    sx={{ mb: { xs: "1rem", lg: 0 }, mt: { lg: "1rem" } }}>
                    {store.previousShifts.length > 0 ? (
                        <section>
                            <Typography variant="h3">
                                Recent Shifts
                            </Typography>
                            <Stack spacing={2} sx={{ mt: 1 }}>
                                {store.previousShifts.slice(0, 3).map(shift => {
                                    return <Shift key={shift._id} shift={shift} />
                                })}
                            </Stack>
                        </section>
                    ) : (
                        <Typography variant="h3">No Recent Shifts</Typography>
                    )}
                </Box>

                <Box gridArea={{
                    xs: "2 / 1 / span 1 / span 12",
                    lg: "1 / 4 / span 12 / span 9"
                }}
                    sx={{ mb: { xs: "2rem", lg: 0 } }}>
                    <Box id="calendar">
                        <CalendarDayGrid />
                    </Box>
                </Box>

                <Modal>
                    <Outlet />
                </Modal>

                {store.selectedShift ?
                    <ShiftDetails isLoading={isLoading} /> : null
                }
            </Box>
        ) : <Navigate to="/" />
    )
}

export default Calendar;
