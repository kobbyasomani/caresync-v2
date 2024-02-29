import { React, useCallback } from "react";
import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";

import {
    Card, CardContent, CardActionArea,
    Typography, Box, useTheme
} from "@mui/material"
import ReportIcon from '@mui/icons-material/Report';

const Incident = ({ incident, index }) => {
    const { dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const theme = useTheme();

    const openIncident = useCallback(() => {
        modalDispatch({
            type: "setActiveDrawer",
            data: "incident report details"
        });
        dispatch({
            type: "setSelectedIncidentReport",
            data: incident
        });

    }, [modalDispatch, dispatch, incident]);

    return (
        <Card variant="outlined" className="incident" data-testid="incident"
            sx={{ display: "flex", alignItems: "center" }}>
            <CardActionArea onClick={openIncident}>
                <CardContent>
                    <Box sx={{ display: "flex" }}>
                        <ReportIcon sx={{ mr: "0.5rem" }} />
                        <Typography variant="h6" component="p" className="shift-date" fontWeight="bold">
                            {incident ? `Incident ${index}` : "Could not load incident number"}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="body1" className="shift-carer">
                            {incident ?
                                incident.incidentReportText.length <= 240 ?
                                    incident.incidentReportText :
                                    <>
                                        {incident.incidentReportText.slice(0, 240)}
                                        ... <span style={{ color: theme.palette.primary.main }}>
                                            Read more
                                        </span>
                                    </>
                                : "Could not load incident"}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default Incident