import React from "react"
import { useGlobalContext } from "../../utils/globalUtils";
import { Typography, Box } from "@mui/material";

const IncidentReportDetails = () => {
    const { store } = useGlobalContext();

    return (
        <>
            <Typography variant="h3" component="p">
                Incident Report
            </Typography>
            <Box sx={{ pt: 1 }}>
                <Typography variant="body1">
                    {store.selectedIncident.incidentReportText}
                </Typography>
            </Box>
        </>
    )
}

export default IncidentReportDetails