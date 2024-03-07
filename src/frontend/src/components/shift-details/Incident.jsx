import { React, useCallback } from "react";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import Confirmation from "../dialogs/Confirmation";

import {
    Card, CardContent, CardActionArea, IconButton,
    Typography, Box, useTheme, Tooltip
} from "@mui/material"
import ReportRoundedIcon from "@mui/icons-material/ReportRounded";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const Incident = ({ incident, index }) => {
    const { dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const theme = useTheme();
    const modalId = `delete_incident_${incident._id}`;

    const openIncident = useCallback((event) => {
        console.log(event.target);
        if (event.target.classList.contains("delete-incident")) {
            // TODO: Confirm Delete Incident
        } else {
            modalDispatch({
                type: "setActiveDrawer",
                data: "incident report details"
            });
            dispatch({
                type: "setSelectedIncidentReport",
                data: incident
            });
        }
    }, [modalDispatch, dispatch, incident]);

    const handleConfirmDeleteIncident = useCallback(() => {
        modalDispatch({
            type: "open",
            data: "confirmation",
            id: modalId
        });
    }, []);

    const handleDeleteIncident = useCallback(() => {

    }, []);

    return (
        <>
            {/* // TODO: Make incidents editable and deleteable */}
            <Card variant="outlined" className="incident" data-testid="incident"
                sx={{ display: "flex", alignItems: "center", position: "relative" }}>
                <CardActionArea onClick={openIncident} sx={{ pl: 3 }}>
                    <CardContent sx={{ pt: 1.5 }}>
                        <Box sx={{ display: "flex" }}>
                            <ReportRoundedIcon sx={{
                                mr: "0.5rem", position: "absolute", top: 5, left: 3,
                                color: theme.palette.primary.light, width: "2rem"
                            }} />
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
                                                <small>Read more</small>
                                            </span>
                                        </>
                                    : "Could not load incident"}
                            </Typography>
                        </Box>
                    </CardContent>
                </CardActionArea>
                <Tooltip title="Delete incident" placement="left">
                    <IconButton size="small" className="delete-incident" onClick={handleConfirmDeleteIncident}
                        sx={{
                            color: theme.palette.error.main,
                            position: "absolute", top: 5, right: 5
                        }}>
                        <DeleteForeverIcon />
                    </IconButton>
                </Tooltip>
            </Card>
            <Confirmation
                modalId={modalId}
                title="Confirm delete incident"
                text="Are you sure you want to delete this incident report? It will be permanently removed from the shift."
                callback={handleDeleteIncident}
                cancelText="Keep incident"
                confirmText="Delete incident"
            >
                <Typography variant="body1" sx={{ mt: 2 }}>
                    <span style={{ fontSize: "2rem", lineHeight: "100%", verticalAlign: "sub", color: theme.palette.primary.main }}>&ldquo;</span>
                    {incident.incidentReportText.length <= 140 ?
                        incident.incidentReportText
                        : <>{incident.incidentReportText.slice(0, 140)} ...</>
                    }
                    <span style={{ fontSize: "2rem", lineHeight: "100%", verticalAlign: "sub", color: theme.palette.primary.main }}>&rdquo;</span>
                </Typography>
            </Confirmation>
        </>
    );
}

export default Incident