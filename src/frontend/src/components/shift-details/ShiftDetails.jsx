import { useCallback, useEffect } from "react";
import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { dateAsObj, plusHours } from "../../utils/dateUtils";
import Overview from "./Overview";
import ShiftNotes from "./ShiftNotes";
import HandoverNotes from "./HandoverNotes";
import IncidentReports from "./IncidentReports";
import CreateIncidentReport from "./CreateIncidentReport";
import IncidentReportDetails from "./IncidentReportDetails";

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

    const injectActiveDrawer = () => {
        switch (modalStore.activeDrawer) {
            case "shift notes":
                return <ShiftNotes />
            case "handover notes":
                return <HandoverNotes />
            case "incident reports":
                return <IncidentReports />
            case "create incident report":
                return <CreateIncidentReport />
            case "incident report details":
                return <IncidentReportDetails />
            default:
                return <Overview />
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
                            {store.selectedPatient.firstName} {store.selectedPatient.lastName}
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
            data: new Date(store.selectedShift.shiftStartTime) < new Date()
                && plusHours(new Date(store.selectedShift.shiftEndTime), 8) > new Date()
        });
    }, [store.selectedShift, dispatch]);

    return isLoading ? null : (
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