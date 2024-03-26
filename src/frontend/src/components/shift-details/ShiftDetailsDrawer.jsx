import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { dateAsObj, plusHours } from "../../utils/dateUtils";
import Loader from "../logo/Loader";

import EditShiftForm from "../forms/EditShiftForm";
import ConfirmCancelShift from "../dialogs/ConfirmCancelShift";

import {
    Grid, Box, Stack, Typography, Drawer, IconButton, Alert,
    Tooltip, useTheme, Fade
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

const ShiftDetailsDrawer = ({ isLoading }) => {
    const { store, dispatch } = useGlobalContext();
    const { modalStore, modalDispatch } = useModalContext();
    const theme = useTheme();
    const [shifts, setShifts] = useState(store.shifts);
    const [shiftUtils, setShiftUtils] = useState({});

    const navigate = useNavigate();
    const location = useLocation();

    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transition, setTransition] = useState({
        time: 100
    });

    const getShiftUtils = useCallback(() => {
        const currentTime = new Date();
        const lastShift = shifts.length > 0 ? shifts[shifts.length - 1] : null;
        const penultimateShift = shifts.length > 1 ? shifts[shifts.length - 2] : null;
        const shift = store.selectedShift;
        const shiftStartTime = new Date(shift.shiftStartTime);
        const shiftEndTime = new Date(shift.shiftEndTime);
        const shiftUtils = { _id: shift._id };
        const editWindow = 8; // Time in hours
        const shiftEndTimePlusEditWindow = plusHours(shiftEndTime, editWindow);

        const getShiftIndex = (shift) => {
            const index = shifts.findIndex(element => element._id === shift._id);
            return index;
        };
        shiftUtils.index = getShiftIndex(shift);
        // Store the next, and previous shifts
        shiftUtils.nextShift = shifts.length === 0 || shift._id === lastShift._id ? null : shifts[getShiftIndex(shift) + 1];
        const nextShiftStart = shiftUtils.nextShift ? new Date(shiftUtils.nextShift.shiftStartTime) : null;
        const nextShiftStartPlusTwoHours = shiftUtils.nextShift ? plusHours(new Date(shiftUtils.nextShift.shiftStartTime), 2) : null;
        shiftUtils.prevShift = shifts.length > 1 && shifts[0] !== shift._id ? shifts[getShiftIndex(shift) - 1] : null;

        shiftUtils.userIsShiftCarer = store.selectedShift?._id && (store.user._id === store.selectedShift.carer._id);
        shiftUtils.isLastShift = shifts.length > 0 ? shift._id === lastShift._id : false;
        shiftUtils.isPenultimateShift = shift._id === penultimateShift?._id;
        shiftUtils.isPending = currentTime < shiftStartTime;
        shiftUtils.isInProgress = shiftStartTime < currentTime && shiftEndTime > currentTime;
        shiftUtils.hasEnded = currentTime > shiftEndTime;
        shiftUtils.nextShiftHasStarted = Boolean(shiftUtils.nextShift) && currentTime > nextShiftStart;
        shiftUtils.isInEditWindow = shiftUtils.hasEnded && shiftEndTimePlusEditWindow > currentTime
            && (shiftUtils.isLastShift
                || nextShiftStartPlusTwoHours > currentTime
                || shiftUtils.nextShiftHasStarted === false);
        shiftUtils.editWindowEndTime = shiftUtils.isLastShift ? shiftEndTimePlusEditWindow.toLocaleString("en-AU", { dateStyle: "long", timeStyle: "short" })
            : shiftEndTimePlusEditWindow < nextShiftStartPlusTwoHours ?
                shiftEndTimePlusEditWindow : nextShiftStartPlusTwoHours;

        dispatch({
            type: "SetShiftUtils",
            data: shiftUtils
        });
        return shiftUtils;

    }, [shifts, store.user._id, store.selectedShift, dispatch]);

    const handleViewShift = useCallback((direction) => {
        let selectedShift;
        const prevShift = shiftUtils.prevShift;
        const nextShift = shiftUtils.nextShift;
        if ((direction === "prev" && prevShift === null)
            || (direction === "next" && nextShift === null)
            || (direction === "in-progress" && Object.keys(store.inProgressShift).length === 0)) {
            return;
        } else {
            selectedShift = direction === "prev" ? prevShift
                : direction === "next" ? nextShift
                    : store.inProgressShift;
            if (transition.timeout) {
                clearTimeout(transition.timeout);
            }
            setIsTransitioning(true);
            setTimeout(() => {
                setIsTransitioning(false);
            }, transition.time * 1.5);
            setTransition(prev => {
                return {
                    ...prev,
                    timeout: setTimeout(() => {
                        dispatch({
                            type: "setSelectedShift",
                            data: selectedShift
                        });
                        navigate("/calendar/shift-details");
                    }, transition.time)
                }
            });
        }
    }, [dispatch, shiftUtils, transition, store.inProgressShift, navigate]);

    const drawerContentWidth = "100%";
    const handleCloseDrawer = useCallback((event) => {
        // Prevent non-Escape keypresses while drawer is open from closing it
        if (event.type === 'keydown' && (event.key !== 'Escape')) {
            return;
        }
        modalDispatch({
            type: "close",
            data: "drawer"
        });
        setTimeout(() => {
            navigate("/calendar");
        }, 200);
    }, [modalDispatch, navigate]);

    const handleBackToPrevDrawer = useCallback(() => {
        // navigate(-1)
        navigate(location.pathname.slice(0, location.pathname.lastIndexOf("/")));
    }, [navigate, location.pathname]);

    const renderShiftNav = useCallback(() => {
        // TODO: Add a 'Home' button to return to the shift overview from any nested view
        return <>
            <Box sx={{ position: "absolute", top: "0.75rem", left: { xs: "0.5rem", lg: "1rem" } }}>
                <Tooltip title="Previous shift" placement="left">
                    <span>
                        <IconButton color="primary" aria-label="Go to previous shift"
                            onClick={() => handleViewShift("prev")}
                            disabled={Boolean(!shiftUtils.prevShift)}>
                            <ArrowBackRoundedIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                {Boolean(store.inProgressShift?._id) ?
                    <Tooltip title="In-progress shift">
                        <span>
                            <IconButton color="primary" aria-label="Go to in-progress shift"
                                onClick={() => handleViewShift("in-progress")}
                                disabled={shiftUtils.isInProgress}>
                                <TodayRoundedIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    : null}
                <Tooltip title="Next shift" placement="right">
                    <span>
                        <IconButton color="primary" aria-label="Go to next shift"
                            onClick={() => handleViewShift("next")}
                            disabled={Boolean(!shiftUtils.nextShift)}>
                            <ArrowForwardRoundedIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>

            <Box sx={{ position: "absolute", top: "0.75rem", right: "0.5rem" }}>
                {modalStore.drawerIsOpen && location.pathname !== "/calendar/shift-details" ? (
                    <IconButton className="prev-modal"
                        onClick={handleBackToPrevDrawer}>
                        <ArrowBackIcon />
                    </IconButton>
                ) : null}
                <IconButton className="close-modal"
                    onClick={handleCloseDrawer}>
                    <CloseIcon />
                </IconButton>
            </Box></>
    }, [location.pathname, modalStore.drawerIsOpen, handleBackToPrevDrawer, handleCloseDrawer, handleViewShift,
        shiftUtils, store.inProgressShift]);

    const renderContent = useCallback(() => {
        return <Box
            sx={{ width: drawerContentWidth, p: { xs: 2, lg: 3 }, pt: { xs: 7, lg: 7.5 }, mt: 1 }}
            role="presentation"
            onKeyDown={handleCloseDrawer}>
            <Grid container rowSpacing={2} columnSpacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={1}>
                        <PersonIcon fontSize="medium" sx={{ color: theme.palette.primary.main }} />
                        <Typography variant="h5" component="p" color={theme.palette.primary.main}>
                            {store.selectedClient.firstName} {store.selectedClient.lastName}
                        </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ color: theme.palette.primary.main }}>
                        {`with carer ${store.selectedShift.carer.firstName} 
                            ${store.selectedShift.carer.lastName}`}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h2" component="p">
                        Shift on {Object.keys(store.selectedShift).length > 0 ? (
                            dateAsObj(store.selectedShift.shiftStartTime).toLocaleDateString("en-AU", { dateStyle: "long" })
                        ) : "D Month YYYY"
                        }
                    </Typography>
                    <Typography variant="h3" component="p">
                        {Object.keys(store.selectedShift).length > 0 ? (
                            `${dateAsObj(store.selectedShift.shiftStartTime).toLocaleTimeString("en-AU", { timeStyle: "short" })} – 
                ${dateAsObj(store.selectedShift.shiftEndTime).toLocaleTimeString("en-AU", { timeStyle: "short" })}`
                        ) : "00:00 – 00:00"}
                    </Typography>
                </Grid>
                {shiftUtils.isPending || shiftUtils.isInProgress || shiftUtils.isInEditWindow ?
                    (
                        <Grid item xs={12}>
                            <Tooltip title={shiftUtils.hasEnded ? `Shifts notes, incident reports, and handover can be added  
                            within eight hours of the shift ending time, or in the first two hours of the next shift, whichever is earlier.` : ""}>
                                <Alert icon={<TodayRoundedIcon />}
                                    severity={shiftUtils.isPending ? "info"
                                        : shiftUtils.isInProgress ? "success"
                                            : "warning"}>
                                    This shift {shiftUtils.isPending ? "is pending. "
                                        : shiftUtils.isInProgress ? "is in progress. "
                                            : `has ended. `}
                                    {shiftUtils.hasEnded ? (
                                        <>
                                            {shiftUtils.userIsShiftCarer ? "You can add notes until "
                                                : "Notes can be added or amended until "}
                                            {shiftUtils.editWindowEndTime.toLocaleString(
                                                "en-AU", { dateStyle: "long", timeStyle: "short" })}
                                        </>
                                    ) : null}
                                </Alert>
                            </Tooltip>
                        </Grid>
                    ) : null
                }
            </Grid>
            <Outlet />
            {store.selectedShift?._id ?
                <>
                    <EditShiftForm />
                    <ConfirmCancelShift />
                </>
                : null
            }
        </Box >
    }, [handleCloseDrawer, shiftUtils, store.selectedClient, store.selectedShift, theme]);

    useEffect(() => {
        modalDispatch({
            type: "open",
            data: "drawer"
        });
    }, [modalDispatch]);

    useEffect(() => {
        setShifts(store.shifts);
        if (store.selectedShift?._id) {
            const updatedShiftUtils = getShiftUtils();
            setShiftUtils(updatedShiftUtils);
            dispatch({
                type: "setShiftUtils",
                data: updatedShiftUtils
            });
        }
    }, [store.selectedClient, getShiftUtils, store.selectedShift, store.shifts, dispatch]);

    /* Sets whether the selected shift is in progress,
    determining whether carer can enter notes and reports) */
    useEffect(() => {
        dispatch({
            type: "setSelectedShiftIsInProgress",
            data: shiftUtils.isInProgress
        });
    }, [store.selectedShift, dispatch, shiftUtils]);

    return isLoading || !store.selectedShift?._id ? <Loader /> : (
        <Drawer
            id="shift-details-drawer"
            anchor="right"
            open={modalStore.drawerIsOpen}
            onClose={handleCloseDrawer}>
            {renderShiftNav()}
            <Fade in={!isTransitioning}>
                {renderContent()}
            </Fade>
        </Drawer>
    )
}

export default ShiftDetailsDrawer;
