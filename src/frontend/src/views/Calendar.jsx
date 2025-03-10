import { useEffect, useState, useCallback, useRef } from "react";
import { Outlet, useNavigate, Navigate } from "react-router-dom";

import { useGlobalContext } from "../utils/globalUtils";
import { useModalContext } from "../utils/modalUtils";
import { getClient, getAllShifts } from "../utils/apiUtils";
import { findPreviousShifts, findInProgressShift, findNextUpcomingShift } from "../utils/calendarUtils";
import SwitchClient from "../components/SwitchClient";
import Shift from "../components/Shift";
import CalendarDayGrid from "../components/CalendarDayGrid";
import Loader from "../components/logo/Loader";
import { SidebarButtonAddShift } from "../components/root/Buttons";

import MyAccount from "../components/dialogs/MyAccount";
import CareTeamList from "../components/dialogs/CareTeamList";
import InviteCarerForm from "../components/forms/InviteCarerForm";
import SelectShiftByDate from "../components/dialogs/SelectShiftByDate";
import AddShiftForm from "../components/forms/AddShiftForm";

import {
    Typography, Stack, Box, IconButton, Tooltip, Button,
    Avatar, useTheme, Card, CardActionArea, CardContent,
    useMediaQuery
} from "@mui/material"
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PersonIcon from '@mui/icons-material/Person';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';

// Care team member component (Care team mini-list in Calendar view)
const CareTeamMember = ({ carer }) => {
    const { store } = useGlobalContext();
    const theme = useTheme();

    const userIsCoordinator = (userId) => {
        return userId === store.selectedClient.coordinator._id;
    };

    return (
        <Stack direction="row" gap={1.5} alignItems="center">
            <Avatar sx={{
                width: "1.5rem", height: "1.5rem",
                backgroundColor: theme.palette.primary.main
            }}>
                <PersonIcon fontSize="small" />
            </Avatar>
            <Box>
                {userIsCoordinator(carer._id) ?
                    <small style={{
                        color: theme.palette.primary.main,
                        left: 0,
                        fontWeight: "bold",
                        fontSize: "100%"
                    }}>Coordinator</small>
                    : null}
                {carer.isSample ? <small style={{
                    color: theme.palette.grey[700],
                    left: 0,
                    fontSize: "100%"
                }}>(Sample)</small>
                    : null}
                <Typography variant="body1" position="relative">
                    {carer.firstName} {carer.lastName}
                </Typography>
            </Box>
        </Stack>
    );
}

export const Calendar = () => {
    const { store, dispatch } = useGlobalContext();
    const { handleLogout } = store.functions;
    const { modalDispatch } = useModalContext();
    const [isLoading, setIsLoading] = useState(true);
    const client = store.selectedClient;
    const [inProgressShift, setInProgressShift] = useState({});
    const [newShiftCreated, setNewShiftCreated] = useState(false);
    const [addShiftFormTrigger, setAddShiftFormTrigger] = useState(null);
    const theme = useTheme();
    const navigate = useNavigate();
    const xsScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const handleRefreshClient = useCallback(async () => {
        if (client?._id) {
            getClient(client._id).then((client) => {
                dispatch({
                    type: "setSelectedClient",
                    data: client
                });
            });
        }
    }, [dispatch, client._id]);

    const refreshCalendarTimeout = useCallback(() => {
        return setTimeout(() => {
            if (!client._id && store.prevSelectedClient._id) {
                dispatch({
                    type: "setSelectedClient",
                    data: store.prevSelectedClient
                });
            } else if (!client._id && !store.prevSelectedClient._id) {
                navigate("/");
            }
        }, 100);
    }, [navigate, dispatch, client._id, store.prevSelectedClient]);

    const handleRefreshCalendar = useCallback(async () => {
        if (client?._id) {
            getAllShifts(client._id)
                .then((shifts) => {
                    const previousShifts = findPreviousShifts(shifts);
                    const inProgressShift = findInProgressShift(shifts);
                    setInProgressShift(inProgressShift);
                    const featuredShift = findNextUpcomingShift(shifts);
                    dispatch({
                        type: "updateStore",
                        data: {
                            shifts,
                            previousShifts,
                            inProgressShift,
                            featuredShift,
                        }
                    });
                    setIsLoading(false);
                });
        }
    }, [dispatch, client._id]);

    const handleSelectInProgressShift = () => {
        dispatch({
            type: "setSelectedShift",
            data: inProgressShift
        });
        navigate("/calendar/shift-details");
    }

    const handleOpenCareTeamList = useCallback(() => {
        handleRefreshClient();
        modalDispatch({
            type: "open",
            data: "modal",
            id: "care-team-list"
        });
    }, [modalDispatch, handleRefreshClient]);

    // Calendar ref and API
    const calendarRef = useRef(null);
    const calendarApi = useCallback(() => {
        return calendarRef.current.getApi();
    }, []);
    const [calendarView, setCalendarView] = useState({
        view: xsScreen ? "listMonth" : "dayGridMonth",
        toggleText: "List view",
        userView: "dayGridMonth"
    });

    const getScreenSize = useCallback(() => {
        let size = "xs";
        switch (true) {
            case window.innerWidth < theme.breakpoints.values.sm:
                size = "xs"; break;
            case window.innerWidth < theme.breakpoints.values.md:
                size = "sm"; break;
            case window.innerWidth < theme.breakpoints.values.lg:
                size = "md"; break;
            case window.innerWidth < theme.breakpoints.values.xl:
                size = "lg"; break;
            default:
                size = "xl"; break;
        }
        return size;
    }, [theme.breakpoints.values]);
    const [screenSize, setScreenSize] = useState(getScreenSize());

    const toggleCalendarView = useCallback(() => {
        setCalendarView(prev => {
            const toggleText = prev.toggleText === "Grid view" ? "List view" : "Grid view";
            const view = prev.view === "dayGridMonth" ? "listMonth" : "dayGridMonth"
            return {
                view: view,
                toggleText: toggleText,
                userView: view
            }
        });
    }, [setCalendarView]);

    // Logout user if auth fails
    useEffect(() => {
        if (!store.isAuth) {
            handleLogout();
        }
    }, [store.isAuth, handleLogout]);

    useEffect(() => {
        const handleResize = () => {
            setScreenSize(getScreenSize());
        }
        window.addEventListener("resize", handleResize);
        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, [getScreenSize]);

    useEffect(() => {
        if (calendarRef.current !== null) {
            if (["xs"].includes(screenSize)) {
                setCalendarView(prev => {
                    return {
                        ...prev,
                        view: "listMonth",
                        toggleText: "Grid view"
                    }
                });
            } else {
                setCalendarView(prev => {
                    return {
                        ...prev,
                        view: prev.userView,
                        toggleText: prev.userView === "dayGridMonth" ? "List view" : "Grid view"
                    }
                });
            }
            calendarApi().render();
        }
    }, [screenSize, calendarApi]);

    useEffect(() => {
        if (calendarRef.current) {
            calendarApi().changeView(calendarView.view);
        }
    }, [calendarView, calendarApi]);

    useEffect(() => {
        handleRefreshClient();
    }, [handleRefreshClient, store.refreshCalendar]);

    // Refresh the calendar when user, client, or refresh state change
    useEffect(() => {
        const calendarTimeout = refreshCalendarTimeout();
        handleRefreshCalendar();

        return () => {
            clearTimeout(calendarTimeout)
        };
    }, [refreshCalendarTimeout, handleRefreshCalendar,
        store.user, store.selectedClient, store.refreshCalendar]);

    return isLoading ? <Loader /> :
        client?._id ? (
            <>
                <Box display="grid"
                    gridTemplateColumns="repeat(12, 1fr)"
                    gap={2}
                >
                    <Box sx={{ mt: { lg: "1rem" } }}
                        gridArea={{
                            xs: "auto / 1 / span 1 / span 12",
                            lg: "auto / 1 / span 1 / span 3"
                        }}>
                        <Stack direction="row" alignItems="center" gap={2}>
                            <SwitchClient />
                            <Tooltip title="Care Team" placement="left">
                                <IconButton color="primary" size="large"
                                    aria-label="care team"
                                    sx={{
                                        ml: "auto",
                                        backgroundColor: theme.palette.primary.light,
                                        display: { lg: "none" }
                                    }}
                                    variant="contained"
                                    id="care-team-button"
                                    onClick={handleOpenCareTeamList}
                                >
                                    <Diversity3Icon />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Box>

                    <Box id="careTeam"
                        gridArea={{
                            xs: "auto / 1 / span 1 / span 12",
                            lg: "auto / 1 / span 1 / span 3"
                        }}
                        sx={{ display: { xs: "none", lg: "initial" }, mt: "auto" }}>
                        <section style={{ mt: 0 }}>
                            <Card variant="outlined">
                                <CardActionArea onClick={handleOpenCareTeamList}>
                                    <CardContent>
                                        <Typography variant="h3" mb={1}>
                                            Care Team
                                        </Typography>
                                        <Stack gap={1}>
                                            <CareTeamMember carer={client.coordinator} id={client.coordinator._id} />
                                            {client.carers?.length > 0 ?
                                                client.carers.filter(carer => carer._id !== client.coordinator._id).map(carer => {
                                                    return <CareTeamMember carer={carer} id={carer._id} key={carer._id} />
                                                })
                                                : null}
                                        </Stack>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </section>
                    </Box>

                    {inProgressShift?._id ? (
                        <Box id="inProgressShift"
                            gridArea={{
                                xs: "auto / 1 / span 1 / span 12",
                                lg: "auto / 1 / span 1 / span 3"
                            }}>
                            <Button onClick={handleSelectInProgressShift}
                                variant="contained" size="large" startIcon={<TodayRoundedIcon />}
                                sx={{ textAlign: "left", textTransform: "capitalize", width: "100%" }}>
                                View in-progress shift
                            </Button>
                        </Box>
                    ) : null}

                    <Box id="upcomingShift"
                        gridArea={{
                            xs: "auto / 1 / span 1 / span 12",
                            lg: "auto / 1 / span 1 / span 3"
                        }}
                        sx={{
                            bgcolor: theme.palette.primary.light,
                            borderRadius: "0.25rem",
                            padding: 2,
                            position: "relative",
                        }}>
                        {store.featuredShift?._id ? (
                            <section>
                                <Typography variant="h3" component="h2" sx={{ mb: 1 }}>
                                    Upcoming Shift
                                </Typography>
                                <Shift featured shift={store.featuredShift} cardDirection="column" />
                                <SidebarButtonAddShift variant={{ xs: "full", xl: "icon-only" }}
                                    calendarApi={calendarApi}
                                    setAddShiftFormTrigger={setAddShiftFormTrigger} />
                            </section>
                        ) : (
                            <section>
                                <Typography variant="h3" component="h2">
                                    No upcoming shift
                                </Typography>
                                <SidebarButtonAddShift variant={{ xl: "full" }} calendarApi={calendarApi}
                                    setAddShiftFormTrigger={setAddShiftFormTrigger} />
                            </section>
                        )}
                    </Box>

                    <Box id="recentShifts"
                        gridArea={{
                            xs: "auto / 1 / span 1 / span 12",
                            lg: "auto / 1 / span 1 / span 3"
                        }}
                        sx={{ mb: { xs: "1rem", lg: 0 } }}>
                        {store.previousShifts.length > 0 ? (
                            <section>
                                <Typography variant="h3">
                                    Recent Shifts
                                </Typography>
                                <Stack spacing={2} sx={{ mt: 1 }}>
                                    {[...store.previousShifts].reverse().slice(0, 3)
                                        .filter(shift => shift._id !== inProgressShift._id)
                                        .map(shift => {
                                            return <Shift key={shift._id} shift={shift} cardDirection="column" />
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
                        sx={{ mb: { xs: 1, lg: 0 } }}>
                        <Box id="calendar" data-testid="calendar">
                            <CalendarDayGrid
                                ref={calendarRef}
                                calendarApi={calendarApi}
                                calendarView={calendarView}
                                setCalendarView={setCalendarView}
                                toggleCalendarView={toggleCalendarView}
                                setAddShiftFormTrigger={setAddShiftFormTrigger}
                            />
                        </Box>
                    </Box>
                </Box >
                <Outlet />
                <MyAccount />
                <CareTeamList />
                <InviteCarerForm />
                <SelectShiftByDate />
                <AddShiftForm newShiftCreated={newShiftCreated} setNewShiftCreated={setNewShiftCreated}
                    trigger={addShiftFormTrigger} />
            </>
        ) : <Navigate to="/" />
}

export default Calendar;
