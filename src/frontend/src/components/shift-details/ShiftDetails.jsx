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
import Loader from "../logo/Loader";

import {
    Grid, Box, Stack, Typography, Drawer, IconButton, useTheme
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ShiftDetails = ({ isLoading, children }) => {
    const { store, dispatch } = useGlobalContext();
    const { modalStore, modalDispatch } = useModalContext();
    const theme = useTheme();
    const [shiftUtils, setShiftUtils] = useState({});

    const getShiftUtils = useCallback(() => {
        const shifts = store.shifts;
        const lastShift = shifts[shifts.length - 1];
        const penultimateShift = shifts[shifts.length - 2];
        const shift = store.selectedShift;
        const shiftUtils = { _id: shift._id };
        const editWindow = 8; // Time in hours

        const getShiftIndex = (shift) => {
            const index = shifts.findIndex(element => element._id === shift._id);
            return index;
        };

        // Store the next, and previous shifts
        shiftUtils.nextShift = shift._id === lastShift._id ? false : shifts[getShiftIndex(shift) + 1];
        shiftUtils.prevShift = shifts[getShiftIndex(shift) - 1];

        // Check if the current user is the carer
        shiftUtils.userIsCarer = Boolean(store.selectedShift._id
            && (store.user._id === store.selectedShift.carer._id));
        // Check if the shift is the last shift
        shiftUtils.isLastShift = Boolean(shift._id === lastShift._id);
        // Check if the shift is the penultimate shift
        shiftUtils.isPenultimateShift = Boolean(shift._id === penultimateShift._id);
        // Check if the shift is pending
        shiftUtils.isPending = Boolean(new Date() < new Date(shift.shiftStartTime));
        // Check if the shift is in progress
        shiftUtils.isInProgress = Boolean(new Date(shift.shiftStartTime) < new Date()
            && new Date(shift.shiftEndTime) > new Date());
        // Check if the shift has ended
        shiftUtils.hasEnded = Boolean(new Date() > new Date(shift.shiftEndTime));
        // Check if the shift is within its edit window
        shiftUtils.isInEditWindow = Boolean(
            (new Date() > new Date(shift.shiftEndTime))
            && (plusHours(new Date(store.selectedShift.shiftEndTime), editWindow) > new Date())
            && !shiftUtils.nextShiftHasStarted);
        // Check if the next shift has started
        shiftUtils.nextShiftHasStarted = Boolean(shiftUtils.nextShift
            && (new Date() > new Date(shiftUtils.nextShift.shiftStartTime)));

        return shiftUtils;

    }, [store.user._id, store.shifts, store.selectedShift]);

    useEffect(() => {
        setShiftUtils(getShiftUtils());
    }, [getShiftUtils]);

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
                return <IncidentReportDetails />
            default:
                return <Overview shiftUtils={shiftUtils} />
        }
    }

    // Sets width of the drawer content column
    const drawerWidth = "100%";
    const closeDrawer = useCallback((event) => {
        // Prevent tab/shift keypresses while drawer is open from closing it
        // if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        //     return;
        // }
        if (event.type === 'keydown' && (event.key !== 'Escape')) {
            return;
        }
        modalDispatch({
            type: "close",
            data: "drawer"
        });
        modalDispatch({
            type: "setActiveDrawer",
            data: ""
        });
    }, [modalDispatch]);

    const backToPrevDrawer = useCallback(() => {
        modalDispatch({
            type: "setActiveDrawer",
            data: "back"
        })
    }, [modalDispatch]);

    const content = () => (
        <Box
            sx={{ width: drawerWidth, p: 2, pt: 3 }}
            role="presentation"
            onKeyDown={closeDrawer}
        >
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
                        Shift on {store.selectedShift ? (
                            dateAsObj(store.selectedShift.shiftStartTime).toLocaleDateString("en-AU", { dateStyle: "long" })
                        ) : "D Month YYYY"
                        }
                    </Typography>
                    <Typography variant="h3" component="p">
                        {store.selectedShift ? (
                            `${dateAsObj(store.selectedShift.shiftStartTime).toLocaleTimeString("en-AU", { timeStyle: "short" })} – 
                ${dateAsObj(store.selectedShift.shiftEndTime).toLocaleTimeString("en-AU", { timeStyle: "short" })}`
                        ) : "00:00 – 00:00"}
                    </Typography>
                </Grid>
            </Grid>

            <IconButton className="close-modal"
                onClick={closeDrawer}
                sx={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}>
                <CloseIcon />
            </IconButton>

            {modalStore.activeDrawer ? (
                <IconButton className="prev-modal"
                    onClick={backToPrevDrawer}
                    sx={{ position: "absolute", top: "0.5rem", right: "3rem" }}>
                    <ArrowBackIcon />
                </IconButton>
            ) : (
                null
            )}

            {injectActiveDrawer()}

            {children}

        </Box>
    );

    /* Sets whether the selected shift is in progress
    (determines whether carer can enter notes and reports) */
    useEffect(() => {
        // console.log(`selected shift in progress: ${new Date(store.selectedShift.shiftStartTime) < new Date()
        //     && new Date(store.selectedShift.shiftEndTime) > new Date()}`);
        dispatch({
            type: "setSelectedShiftInProgress",
            /* Check whether the selected shift is in progress
            or within carer edit window (8 hours) */
            data: shiftUtils.isInProgress && shiftUtils.isInEditWindow
        });
    }, [store.selectedShift, dispatch, shiftUtils]);

    return isLoading ? <Loader /> : (
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
    )
}

export default ShiftDetails;
