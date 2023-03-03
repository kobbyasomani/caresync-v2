import { React, useCallback } from "react";
import { useModalContext } from "../../utils/modalUtils";

import {
    Card, CardContent, CardActionArea,
    Typography, Box, useTheme
} from "@mui/material"
import ReportIcon from '@mui/icons-material/Report';

const Incident = ({ incident, index }) => {
    const { modalDispatch } = useModalContext();
    const theme = useTheme();

    const openIncident = useCallback(() => {
        modalDispatch({
            type: "setActiveDrawer",
            data: "incident details"
        });
    }, [modalDispatch]);

    return (
        <Card variant="outlined" className="incident" data-testid="incident"
            sx={{ display: "flex", alignItems: "center" }}>
            <CardActionArea onClick={openIncident}>
                <CardContent sx={{
                    display: "grid",
                    gridTemplate: "repeat(2, 1fr) / auto 1fr",
                    alignItems: "center"
                }}>
                    <Box sx={{ display: "flex", gridArea: "1 / 1 / 2 / 2", [theme.breakpoints.down("sm")]: { gridArea: "1 / 1 / 2 / 3" } }}>
                        <ReportIcon sx={{ mr: "0.5rem" }} />
                        <Typography variant="body1" className="shift-date" fontWeight="bold">
                            {incident ? `Incident ${index}` : "Could not load incident number"}
                        </Typography>
                    </Box>
                    <Box sx={{ gridArea: "2 / 1 / 3 / 2", [theme.breakpoints.down("sm")]: { gridArea: "2 / 1 / 3 / 3" } }}>
                        <Typography variant="body1" className="shift-carer">
                            {incident ? incident.incidentReportText : "Could not load incident"}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default Incident