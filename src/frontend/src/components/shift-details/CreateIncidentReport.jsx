import { useGlobalContext } from "../../utils/globalUtils";
import IncidentReportForm from "../forms/IncidentReportForm";
import { Typography, Box } from "@mui/material";

const CreateIncidentReport = () => {
    const { store } = useGlobalContext();
    return (
        <>
            <Typography variant="h3" component="p">Incident Reports</Typography>
            <Box sx={{ mt: 1 }}>
                {store.selectedShiftInProgress ? (
                    <IncidentReportForm />
                ) : (
                    new Date(store.selectedShift.shiftEndTime) > new Date() ? (
                        <Typography variant="body1">
                            You'll be able to create incident reports once the shift starts.
                        </Typography>
                    ) : null
                )}
            </Box>
        </>
    )
}

export default CreateIncidentReport