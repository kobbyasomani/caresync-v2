import { useGlobalContext } from "../../utils/globalUtils";
import ShiftNotesForm from "../forms/ShiftNotesForm";
import { ButtonDownload } from "../root/Buttons";

import { Typography, Box, Stack } from "@mui/material";

const ShiftNotes = (props) => {
    const { store } = useGlobalContext();
    const { shiftUtils } = props;

    const renderContent = () => {
        if (store.selectedShift.shiftNotes) {
            return (
                <Typography variant="body1">
                    {store.selectedShift.shiftNotes.shiftNotesText}
                </Typography>
            );
        }
        if (shiftUtils.userIsCarer) {
            switch (true) {
                case ((shiftUtils.isInProgress || shiftUtils.isInEditWindow)
                    && (shiftUtils.isPenultimateShift || shiftUtils.isLastShift)):
                    return <ShiftNotesForm />;
                case shiftUtils.isPending:
                    return (
                        <Typography variant="body1">
                            You'll be able to add shift notes once the shift starts.
                        </Typography>
                    );
                default: break;
            }
        }
        return (
            <Typography variant="body1"> There are no shift notes for this shift. </Typography>
        );

    };

    const renderHeaderButtons = () => {
        if (store.selectedShift.shiftNotes) {
            return (
                <ButtonDownload
                    tooltip="Download Shift Notes"
                    filename="Shift Notes"
                    resourceURL={store.selectedShift.shiftNotes.shiftNotesPDF}
                />
            );
        }
    }

    return (
        <>
            <Stack direction="row" alignItems="flex-end">
                <Typography variant="h3" component="p">Shift Notes</Typography>
                {renderHeaderButtons()}
            </Stack>
            <Box sx={{ mt: 1 }}>
                {renderContent()}
            </Box>
        </>
    )
}

export default ShiftNotes