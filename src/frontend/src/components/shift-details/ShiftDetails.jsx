import { useCallback } from "react";
import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { dateAsObj } from "../../utils/dateUtils";
import Overview from "./Overview";

import {
    Grid, Box, Stack, Typography, Drawer, IconButton, useTheme
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';

const ShiftDetails = ({ children }) => {
    const { store } = useGlobalContext();
    const { modalStore, modalDispatch } = useModalContext();
    const activeDrawer = modalStore.activeDrawer;
    const theme = useTheme();

    const injectActiveDrawer = () => {
        switch (activeDrawer) {
            default: return <Overview />
        }
    }

    const shift = store.selectedShift;
    const patient = store.selectedPatient;
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
            sx={{ drawerWidth, p: 2, pt: 3 }}
            role="presentation"
            onKeyDown={closeDrawer}
        >
            <Grid container rowSpacing={2} columnSpacing={2} alignItems="center" sx={{ pb: 2 }}>
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