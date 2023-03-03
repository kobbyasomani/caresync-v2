import { useGlobalContext } from "../../utils/globalUtils";
import HandoverNotesForm from "../forms/HandoverNotesForm";
import { Typography, Box } from "@mui/material";

const HandoverNotes = () => {
    const { store } = useGlobalContext();

    return (
        <>
            <Typography variant="h3" component="p">Handover Notes</Typography>
            {store.selectedShift.handoverNotes ? (
                <Box sx={{ pt: 1 }}>
                    <Typography variant="body1">
                        {store.selectedShift.handoverNotes}
                    </Typography>
                </Box>
            ) : store.user._id === store.selectedShift.carer._id ? (
                <HandoverNotesForm />
            ) : (
                <Typography variant="body1">
                    There are no handover notes for this shift.
                </Typography>
            )}
        </>
    )
}

export default HandoverNotes