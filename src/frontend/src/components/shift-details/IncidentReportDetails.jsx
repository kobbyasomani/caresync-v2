import React from "react"
import { useGlobalContext } from "../../utils/globalUtils";
import { ButtonDownload } from "../root/Buttons";
import { Typography, Box, Stack } from "@mui/material";

const IncidentReportDetails = () => {
    const { store } = useGlobalContext();

    return (
        <>
            <Stack direction="row" alignItems="flex-end">
                <Typography variant="h3" component="p">Incident Report</Typography>
                {store.selectedShift.incidentReports.length > 0 ? (
                    <ButtonDownload
                        tooltip="Download Incident Report"
                        filename="Incident Report"
                        resourceURL={store.selectedIncidentReport.incidentReportPDF}
                    />
                ) : null
                }
            </Stack>

            <Box sx={{ pt: 1 }}>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                    {store.selectedIncidentReport.incidentReportText}
                </Typography>
            </Box>
        </>
    )
}

export default IncidentReportDetails