import { useCallback } from "react";
import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { dateAsObj } from "../../utils/dateUtils";
import Overview from "./Overview";
import ShiftNotes from "./ShiftNotes";

import {
    Grid, Box, Stack, Typography, Drawer, IconButton, useTheme
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';

const ShiftDetails = ({ isLoading, children }) => {
    const { store } = useGlobalContext();
    const { modalStore, modalDispatch } = useModalContext();
    const theme = useTheme();

    const injectActiveDrawer = () => {
        switch (modalStore.activeDrawer) {
            case "shift notes":
                return <ShiftNotes />
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

    const content = () => (
        <Box
            sx={{ drawerWidth, p: 2, pt: 3 }}
            role="presentation"
            onKeyDown={closeDrawer}
        >
            <Grid container rowSpacing={2} columnSpacing={2} alignItems="center" sx={{ pb: 2 }}>
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
                        ) : "D MONTH YEAR"
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

            {injectActiveDrawer()}

            {children}

        </Box>
    );

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