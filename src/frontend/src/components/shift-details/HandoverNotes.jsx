import { useGlobalContext } from "../../utils/globalUtils";
import HandoverNotesForm from "../forms/HandoverNotesForm";
import { Typography, Box } from "@mui/material";

const HandoverNotes = () => {
    const { store } = useGlobalContext();

    return (
        <>
            <Typography variant="h3" component="p">Handover Notes</Typography>
            <Box sx={{ mt: 1 }}>
                {store.selectedShift.handoverNotes ? (

                    <Typography variant="body1">
                        {store.selectedShift.handoverNotes}
                    </Typography>
                ) : store.user._id === store.selectedShift.carer._id ? (
                    // Handover can be edited during the shift and before the next shift
                    store.selectedShiftInProgress
                        || (new Date() < new Date(store.selectedPatient.nextShift.time)
                            && new Date() > new Date(store.selectedShift.shiftStartTime)) ? (
                        <HandoverNotesForm />
                    ) : (
                        <Typography variant="body1">
                            You'll be able to add handover notes once the shift starts.
                        </Typography>
                    )
                ) : (
                    <Typography variant="body1">
                        There are no handover notes for this shift.
                    </Typography>
                )}
            </Box>
        </>
    )
}

export default HandoverNotes