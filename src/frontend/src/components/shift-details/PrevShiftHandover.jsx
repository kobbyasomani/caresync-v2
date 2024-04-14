import { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import { ButtonPrimary } from "../root/Buttons";

import { Typography, Box, useTheme, Fade, Grow, Breadcrumbs } from "@mui/material";

const PrevShiftHandover = () => {
    const { store } = useGlobalContext();
    const { shiftUtils } = store;
    const theme = useTheme();
    const navUtils = store.navUtils;

    const prevShift = useMemo(() => {
        return shiftUtils.prevShift
    }, [shiftUtils]);
    const prevShiftStart = new Date(prevShift.shiftStartTime);
    const prevShiftEnd = new Date(prevShift.shiftEndTime);

    const handleViewPreviousShift = useCallback(() => {
        navUtils.navigateToShift("prev");
    }, [navUtils]);

    const renderContent = () => {
        if (prevShift && prevShift.handoverNotes) {
            return (
                <>
                    <Typography variant="body1" fontStyle="italic" color={theme.palette.grey[700]}>
                        These are handover notes left by {prevShift.carer.firstName} {prevShift.carer.lastName}
                        &nbsp;after their shift with {store.selectedClient.firstName} {store.selectedClient.lastName}
                        &nbsp;on {prevShiftStart.toLocaleDateString("en-AU", { dateStyle: "long" })} from&nbsp;
                        {prevShiftStart.toLocaleTimeString("en-AU", { timeStyle: "short" })} –&nbsp;
                        {prevShiftEnd.toLocaleTimeString("en-AU", { timeStyle: "short" })}.
                    </Typography>
                    <br></br>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                        {shiftUtils.prevShift.handoverNotes}
                    </Typography>
                </>
            )
        } else {
            return (
                <Typography variant="body1">
                    There are no handover notes from the previous shift.
                </Typography>
            )
        }
    };

    const renderPrevShiftButton = () => {
        return (
            <ButtonPrimary onClick={handleViewPreviousShift} >
                Go to previous shift
            </ButtonPrimary >
        );
    };

    return (
        <>
            <Fade in={true}>
                <Box>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link to="/calendar/shift-details/">Shift details</Link>
                        <Typography>Previous shift handover</Typography>
                    </Breadcrumbs>
                    <Typography variant="h3" mt={2}>Previous Shift Handover</Typography>
                </Box>
            </Fade>
            <Grow in={true}>
                <Box sx={{ mt: 1 }}>
                    {renderContent()}
                    {renderPrevShiftButton()}
                </Box>
            </Grow>

        </>
    )
}

export default PrevShiftHandover