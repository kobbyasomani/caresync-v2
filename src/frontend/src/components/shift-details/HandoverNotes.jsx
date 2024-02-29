import { useGlobalContext } from "../../utils/globalUtils";
import HandoverNotesForm from "../forms/HandoverNotesForm";
import { Typography, Box } from "@mui/material";

const HandoverNotes = (props) => {
    const { store } = useGlobalContext();
    const { shiftUtils } = props;

    const renderContent = () => {
        // Handover is editable when user is the carer and:
        // 1. The shift is still in progress
        // 2. The shift is in the edit window and the next shift has not started
        // 3. The shift is the last shift for the client (no next shift exists)
        if (store.selectedShift.handoverNotes) {
            return (
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                    {store.selectedShift.handoverNotes}
                </Typography>
            )
        }
        if (shiftUtils.userIsCarer) {
            switch (true) {
                case shiftUtils.isInProgress
                    || shiftUtils.isInEditWindow
                    || (shiftUtils.isLastShift && shiftUtils.hasEnded):
                    return <HandoverNotesForm />;
                case shiftUtils.isPending:
                    return (
                        <Typography variant="body1">
                            You'll be able to add handover notes once the shift starts.
                        </Typography>
                    );
                default: break;
            }
        }
        return (
            <Typography variant="body1">
                There are no handover notes for this shift.
            </Typography>
        );
    }

    return (
        <>
            <Typography variant="h3" component="p">Handover Notes</Typography>
            <Box sx={{ mt: 1 }}>
                {renderContent()}
            </Box >
        </>
    )
}

export default HandoverNotes