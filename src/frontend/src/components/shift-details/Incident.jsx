import { React, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { deleteIncidentReport, getAllShifts } from "../../utils/apiUtils";
import Confirmation from "../dialogs/Confirmation";

import {
    Card, CardContent, CardActionArea, IconButton,
    Typography, Box, useTheme, Tooltip
} from "@mui/material"
import ReportRoundedIcon from "@mui/icons-material/ReportRounded";
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';

const Incident = ({ incident, index, shiftUtils }) => {
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const theme = useTheme();
    const modalId = `confirmDeleteIncident_${incident._id}`;
    const [shift, setShift] = useState(store.selectedShift);

    const navigate = useNavigate();

    const handleOpenIncident = useCallback(() => {
        dispatch({
            type: "setSelectedIncidentReport",
            data: incident
        });
        navigate(`/calendar/shift-details/incident-reports/${incident._id}`);
    }, [dispatch, incident, navigate]);

    const handleConfirmDeleteIncident = useCallback(() => {
        dispatch({
            type: "setSelectedIncidentReport",
            data: incident
        });
        modalDispatch({
            type: "open",
            data: "confirmation",
            id: modalId
        });
    }, [dispatch, incident, modalDispatch, modalId]);

    const handleDeleteIncident = useCallback(async () => {
        try {
            await deleteIncidentReport(store.selectedShift._id, incident._id)
                .then(updatedShift => {
                    setShift({ ...updatedShift });
                    getAllShifts(store.selectedClient._id)
                        .then(shifts => {
                            dispatch({
                                type: "setShifts",
                                data: shifts
                            });
                        });
                });
        } catch (error) {
            throw new Error(process.env.NODE_ENV === "development" ? error
                : "The incident report could not be deleted at this time.");
        }
    }, [dispatch, store.selectedShift._id, incident._id, store.selectedClient._id]);

    const handleAfterConfirmDeleteIncident = useCallback(() => {
        dispatch({
            type: "setSelectedIncidentReport",
            data: {}
        });
        dispatch({
            type: "setSelectedShift",
            data: shift
        });
    }, [dispatch, shift]);

    return (
        <>
            <Card variant="outlined" className="incident" data-testid="incident"
                sx={{ display: "flex", alignItems: "center", position: "relative" }}>
                <CardActionArea onClick={handleOpenIncident} sx={{ pl: 3 }}>
                    <CardContent sx={{ pt: 1.5 }}>
                        <Box sx={{ display: "flex" }}>
                            <ReportRoundedIcon className="incident-icon" sx={{
                                mr: "0.5rem", position: "absolute", top: 5, left: 2,
                                color: theme.palette.primary.main, width: "2rem"
                            }} />
                            <Typography variant="h6" component="h4" className="shift-date" fontWeight="bold">
                                {incident ? `Incident ${index}` : "Could not load incident number"}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body1" className="incident-report-summary"
                                sx={{ whiteSpace: "pre-line" }}>
                                {incident ?
                                    incident.incidentReportText.length <= 140 ?
                                        incident.incidentReportText :
                                        <>
                                            {incident.incidentReportText.slice(0, 140)}
                                            ... <span style={{ color: theme.palette.primary.main }}>
                                                Read more
                                            </span>
                                        </>
                                    : "Could not load incident"}
                            </Typography>
                        </Box>
                    </CardContent>
                </CardActionArea>
                {shiftUtils.userIsShiftCarer
                    && (shiftUtils.isInProgress || shiftUtils.isInEditWindow) ?
                    <Tooltip title="Delete incident" placement="left">
                        <IconButton size="small" className="delete-incident" onClick={handleConfirmDeleteIncident}
                            sx={{
                                color: theme.palette.error.light,
                                position: "absolute", top: 5, right: 5
                            }}>
                            <DeleteForeverRoundedIcon />
                        </IconButton>
                    </Tooltip>
                    : null
                }

            </Card>
            <Confirmation
                modalId={modalId}
                title="Confirm delete incident"
                text="Are you sure you want to delete this incident report? It will be permanently removed from the shift."
                callback={handleDeleteIncident}
                cancelText="Keep incident"
                confirmText={<><DeleteForeverRoundedIcon />Delete</>}
                successAlert="The incident report was successfully deleted."
                stayOpenOnConfirm
                afterConfirm={handleAfterConfirmDeleteIncident}
            >
                {Object.keys(store.selectedIncidentReport).length > 0 ?
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        <span style={{ fontSize: "1.7rem", lineHeight: "100%", verticalAlign: "sub", color: theme.palette.primary.main }}>&ldquo; </span>
                        {incident.incidentReportText.length <= 140 ?
                            incident.incidentReportText
                            : <>{incident.incidentReportText.slice(0, 140)} ...</>
                        }
                        <span style={{ fontSize: "1.7rem", lineHeight: "100%", verticalAlign: "sub", color: theme.palette.primary.main }}> &rdquo;</span>
                    </Typography>
                    : null}
            </Confirmation>
        </>
    );
}

export default Incident