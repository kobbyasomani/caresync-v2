import { useGlobalContext } from "../../utils/globalUtils";
import HandoverNotesForm from "../forms/HandoverNotesForm";
import { Typography, Box } from "@mui/material";

const HandoverNotes = () => {
    const { store } = useGlobalContext();
    const noNotes = < Typography variant="body1">There are no handover notes for this shift.</Typography>;

    return (
        <>
            <Typography variant="h3" component="p">Handover Notes</Typography>
            <Box sx={{ mt: 1 }}>
                {store.selectedShift.handoverNotes ? (
                    <Typography variant="body1">
                        {store.selectedShift.handoverNotes}
                    </Typography>
                ) : (
                    // Handover can be edited by the carer during the shift and before the next shift.
                    store.user._id === store.selectedShift.carer._id ? (
                        (store.selectedShiftInProgress
                            || ((store.shifts[store.shifts.length - 1]._id === store.selectedShift._id))
                            && (new Date() > new Date(store.selectedShift.shiftEndDate))) ? (
                            <HandoverNotesForm />
                        ) : (new Date() < new Date(store.selectedShift.shiftStartTime) ? (
                            < Typography variant="body1">
                                You'll be able to add handover notes once the shift starts.
                            </Typography>
                        ) : (
                            noNotes
                        ))
                    ) : (
                        noNotes
                    )
                )}
            </Box >
        </>
    )
}

export default HandoverNotes