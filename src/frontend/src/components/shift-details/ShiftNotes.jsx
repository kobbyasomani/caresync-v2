import { useGlobalContext } from "../../utils/globalUtils";
import ShiftNotesForm from "../forms/ShiftNotesForm";
import { Typography, Box } from "@mui/material";

const ShiftNotes = () => {
    const { store } = useGlobalContext();
    return (
        <>
            <Typography variant="h3" component="p">Shift Notes</Typography>
            {store.selectedShift.shiftNotes ? (
                <Box sx={{ pt: 1 }}>
                    <Typography variant="body1">
                        {store.selectedShift.shiftNotes}
                    </Typography>
                </Box>
            ) : (
                <ShiftNotesForm />
            )}
        </>
    )
}

export default ShiftNotes