import IncidentReportForm from "../forms/IncidentReportForm";
import { Typography, Box } from "@mui/material";

const CreateIncidentReport = (props) => {
    const { shiftUtils } = props;

    const renderContent = () => {
        if (shiftUtils.userIsShiftCarer) {
            switch (true) {
                case (shiftUtils.isInProgress || shiftUtils.isInEditWindow):
                    return (
                        <IncidentReportForm />
                    );
                case shiftUtils.isPending:
                    return (
                        <Typography variant="body1">
                            You'll be able to create incident reports once the shift starts.
                        </Typography>
                    );
                default:
                    return (
                        <Typography variant="body1">
                            You can't create incident reports at this time.
                        </Typography>
                    );
            }
        }
    };

    return (
        <>
            <Typography variant="h3" component="p">Incident Reports</Typography>
            <Box sx={{ mt: 1 }}>
                {renderContent()}
            </Box>
        </>
    )
}

export default CreateIncidentReport