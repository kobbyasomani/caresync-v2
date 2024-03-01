import { useCallback, useMemo } from "react";
import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";

import { ButtonPrimary } from "../root/Buttons";

import { Typography, Box, useTheme } from "@mui/material";

const PrevShiftHandover = (props) => {
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const { shiftUtils } = props;
    const theme = useTheme();

    const prevShift = useMemo(() => shiftUtils.prevShift, [shiftUtils]);
    const prevShiftStart = new Date(prevShift.shiftStartTime);
    const prevShiftEnd = new Date(prevShift.shiftEndTime);

    const handleViewPreviousShift = useCallback(() => {
        dispatch({
            type: "setSelectedShift",
            data: prevShift
        })
        modalDispatch({
            type: "setActiveDrawer",
            data: ""
        })
    }, [dispatch, modalDispatch, prevShift]);

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
                View previous shift
            </ButtonPrimary >
        );
    };

    return (
        <>
            <Typography variant="h3" component="p">Previous Shift Handover</Typography>
            <Box sx={{ mt: 1 }}>
                {renderContent()}
                {renderPrevShiftButton()}
            </Box>
        </>
    )
}

export default PrevShiftHandover