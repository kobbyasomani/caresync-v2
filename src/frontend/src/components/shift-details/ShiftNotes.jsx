import { useGlobalContext } from "../../utils/globalUtils";
import ShiftNotesForm from "../forms/ShiftNotesForm";
import { ButtonDownload } from "../root/Buttons";

import { Typography, Box, Stack } from "@mui/material";

const ShiftNotes = () => {
    const { store } = useGlobalContext();

    return (
        <>
            <Stack direction="row" alignItems="flex-end">
                <Typography variant="h3" component="p">Shift Notes</Typography>
                {store.selectedShift.shiftNotes ? (
                    <ButtonDownload
                        tooltip="Download Shift Notes"
                        filename="Shift Notes"
                        resourceURL={store.selectedShift.shiftNotes.shiftNotesPDF}
                    />
                ) : null
                }
            </Stack>
            <Box sx={{ mt: 1 }}>
                {store.selectedShift.shiftNotes ? (
                    <Typography variant="body1">
                        {store.selectedShift.shiftNotes.shiftNotesText}
                    </Typography>
                ) : store.user._id === store.selectedShift.carer._id
                    && new Date(store.selectedShift.shiftEndTime) > new Date() ? (
                    store.selectedShiftInProgress ? (
                        <ShiftNotesForm />
                    ) : (
                        <Typography variant="body1">
                            You can add shift notes here once the shift starts.
                        </Typography>
                    )
                ) : (
                    <Typography variant="body1">
                        There are no shift notes for this shift.
                    </Typography>
                )}
            </Box>
        </>
    )
}

export default ShiftNotes