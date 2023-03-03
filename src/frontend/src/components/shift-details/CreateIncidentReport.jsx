import IncidentReportForm from "../forms/IncidentReportForm";
import { Typography } from "@mui/material";

const CreateIncidentReport = () => {
    return (
        <>
            <Typography variant="h3" component="p">Incident Reports</Typography>
            <IncidentReportForm />
        </>
    )
}

export default CreateIncidentReport