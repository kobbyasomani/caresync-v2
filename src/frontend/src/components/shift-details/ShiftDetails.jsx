import { useState, useCallback, useEffect } from "react";
import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { dateAsObj, plusHours } from "../../utils/dateUtils";
import Overview from "./Overview";
import ShiftNotes from "./ShiftNotes";
import HandoverNotes from "./HandoverNotes";
import IncidentReports from "./IncidentReports";
import CreateIncidentReport from "./CreateIncidentReport";
import IncidentReportDetails from "./IncidentReportDetails";
import PrevShiftHandover from "./PrevShiftHandover";
import CoordinatorNotes from "./CoordinatorNotes";
import Loader from "../logo/Loader";

import {
    Grid, Box, Stack, Typography, Drawer, IconButton, Alert,
    Tooltip, useTheme
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventNoteIcon from '@mui/icons-material/EventNote';

const ShiftDetails = ({ isLoading, children }) => {
    const { store, dispatch } = useGlobalContext();
    const { modalStore, modalDispatch } = useModalContext();
    const theme = useTheme();
    const [shiftUtils, setShiftUtils] = useState({});

    const getShiftUtils = useCallback(() => {
        const getCurrentTime = () => new Date();
        const shifts = store.shifts;
        const lastShift = shifts.length > 0 ? shifts[shifts.length - 1] : null;
        const penultimateShift = shifts.length > 1 ? shifts[shifts.length - 2] : null;
        const shift = store.selectedShift;
        const shiftStartTime = new Date(shift.shiftStartTime);
        const shiftEndTime = new Date(shift.shiftEndTime);
        const shiftUtils = { _id: shift._id };
        const editWindow = 8; // Time in hours

        const getShiftIndex = (shift) => {
            const index = shifts.findIndex(element => element._id === shift._id);
            return index;
        };

        // Store the next, and previous shifts
        shiftUtils.nextShift = shifts.length === 0 || shift._id === lastShift._id ? null : shifts[getShiftIndex(shift) + 1];
        shiftUtils.prevShift = shifts.length > 1 && shifts[0] !== shift._id ? shifts[getShiftIndex(shift) - 1] : null;

        shiftUtils.userIsShiftCarer = store.selectedShift?._id && (store.user._id === store.selectedShift.carer._id);
        shiftUtils.isLastShift = shifts.length > 0 ? shift._id === lastShift._id : false;
        shiftUtils.isPenultimateShift = shift._id === penultimateShift?._id;
        shiftUtils.isPending = getCurrentTime() < shiftStartTime;
        shiftUtils.isInProgress = shiftStartTime < getCurrentTime() && shiftEndTime > getCurrentTime();
        shiftUtils.hasEnded = getCurrentTime() > shiftEndTime;
        shiftUtils.nextShiftHasStarted = Boolean(shiftUtils.nextShift)
            && getCurrentTime() > new Date(shiftUtils.nextShift.shiftStartTime);
        shiftUtils.isInEditWindow = shiftUtils.hasEnded && plusHours(shiftEndTime, editWindow) > getCurrentTime()
            && (shiftUtils.isLastShift
                || plusHours(new Date(shiftUtils.nextShift?.shiftStartTime), 2) > getCurrentTime()
                || shiftUtils.nextShiftHasStarted === false);
        shiftUtils.editWindowEndTime = shiftUtils.isLastShift ? plusHours(shiftEndTime, editWindow).toLocaleString("en-AU", { dateStyle: "long", timeStyle: "short" })
            : plusHours(new Date(shiftUtils.nextShift?.shiftStartTime), 2);

        return shiftUtils;

    }, [store.user._id, store.shifts, store.selectedShift]);

    useEffect(() => {
        if (Object.keys(store.selectedShift).length > 0) {
            setShiftUtils(getShiftUtils());
        }
    }, [store.selectedClient, getShiftUtils, store.selectedShift, store.shifts]);

    const drawerContentWidth = "100%";
    const closeDrawer = useCallback((event) => {
        // Prevent non-Escape keypresses while drawer is open from closing it
        if (event.type === 'keydown' && (event.key !== 'Escape')) {
            return;
        }
        modalDispatch({
            type: "close",
            data: "drawer"
        });
    }, [modalDispatch]);

    const backToPrevDrawer = useCallback(() => {
        modalDispatch({
            type: "setActiveDrawer",
            data: "back"
        })
    }, [modalDispatch]);

    const renderContent = useCallback(() => {
        // Log drawer state (history and active drawer)
        // console.log(JSON.stringify(modalStore.drawerHistory), modalStore.activeDrawer);

        const injectActiveDrawer = () => {
            switch (modalStore.activeDrawer) {
                case "shift notes":
                    return <ShiftNotes shiftUtils={shiftUtils} />
                case "handover notes":
                    return <HandoverNotes shiftUtils={shiftUtils} />
                case "incident reports":
                    return <IncidentReports shiftUtils={shiftUtils} />
                case "create incident report":
                    return <CreateIncidentReport shiftUtils={shiftUtils} />
                case "incident report details":
                    return <IncidentReportDetails shiftUtils={shiftUtils} />
                case "prev shift handover":
                    return <PrevShiftHandover shiftUtils={shiftUtils} />
                case "coordinator notes":
                    return <CoordinatorNotes shiftUtils={shiftUtils} />
                default:
                    return <Overview shiftUtils={shiftUtils} />
            }
        }

        return <Box
            sx={{ width: drawerContentWidth, p: 3, pt: 4 }}
            role="presentation"
            onKeyDown={closeDrawer}
        >
            {/* //TODO: Add buttons to navigate between current, previous, and next shift */}
            <Grid container rowSpacing={2} columnSpacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={1}>
                        <PersonIcon fontSize="medium" sx={{ color: theme.palette.primary.main }} />
                        <Typography variant="h5" component="p" color={theme.palette.primary.main}>
                            {store.selectedClient.firstName} {store.selectedClient.lastName}
                        </Typography>
                    </Stack>
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
                            within eight hours of the shift ending time or in the first two hours of the next shift, whichever is earlier.` : ""}>
                                <Alert icon={<EventNoteIcon />}
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

            <IconButton className="close-modal"
                onClick={closeDrawer}
                sx={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}>
                <CloseIcon />
            </IconButton>

            {
                modalStore.activeDrawer ? (
                    <IconButton className="prev-modal"
                        onClick={backToPrevDrawer}
                        sx={{ position: "absolute", top: "0.5rem", right: "3rem" }}>
                        <ArrowBackIcon />
                    </IconButton>
                ) : (
                    null
                )
            }

            {injectActiveDrawer()}
            {children}
        </Box >
    }, [backToPrevDrawer, closeDrawer,
        children, modalStore, shiftUtils, store.selectedClient, store.selectedShift, theme]);

    /* Sets whether the selected shift is in progress
    (determines whether carer can enter notes and reports) */
    useEffect(() => {
        dispatch({
            type: "setSelectedShiftInProgress",
            data: shiftUtils.isInProgress
        });
    }, [store.selectedShift, dispatch, shiftUtils]);

    return isLoading ? <Loader /> : (
        <>
            <Drawer
                // variant="persistent"
                anchor="right"
                open={modalStore.drawerIsOpen && Object.keys(store.selectedShift).length > 0}
                onClose={closeDrawer}
            >
                {renderContent()}
            </Drawer>
        </>
    )
}

export default ShiftDetails;
