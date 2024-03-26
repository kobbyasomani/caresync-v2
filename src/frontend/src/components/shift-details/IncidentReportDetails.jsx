import React, { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { deleteIncidentReport, getAllShifts } from "../../utils/apiUtils";
import { ButtonPrimary, ButtonSecondary, ButtonDownload } from "../root/Buttons"
import IncidentReportForm from "../forms/IncidentReportForm";
import Confirmation from "../dialogs/Confirmation";

import { Typography, Box, Stack, useTheme, Fade, Grow } from "@mui/material";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TaskIcon from '@mui/icons-material/Task';
import CancelIcon from '@mui/icons-material/Cancel';

const IncidentReportDetails = () => {
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const { shiftUtils } = store;
    const location = useLocation();

    const [shift, setShift] = useState(store.selectedShift);
    const [incidentReport, setIncidentReport] = useState(store.selectedIncidentReport);
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditable, setIsEditable] = useState(shiftUtils.userIsShiftCarer
        && (shiftUtils.isInProgress || shiftUtils.isInEditWindow));

    const theme = useTheme();
    const modalId = `confirmDeleteIncident_${incidentReport._id}`;
    const formRef = useRef(null);
    const navigate = useNavigate();

    const incidentReportIndex = useMemo(() => {
        return store.selectedShift.incidentReports.indexOf(
            store.selectedShift.incidentReports.find(
                report => report._id === store.selectedIncidentReport._id)) + 1
    }, [store.selectedShift, store.selectedIncidentReport]);

    const toggleEditMode = useCallback((override) => {
        setEditMode(override || !editMode);
    }, [editMode]);

    const handleUpdateIncident = useCallback(() => {
        formRef.current.click();
    }, [formRef]);

    const handleConfirmDeleteIncident = useCallback(() => {
        dispatch({
            type: "setSelectedIncidentReport",
            data: incidentReport
        });
        modalDispatch({
            type: "open",
            data: "confirmation",
            id: modalId
        });
    }, [dispatch, incidentReport, modalDispatch, modalId]);

    const handleDeleteIncident = useCallback(async () => {
        try {
            await deleteIncidentReport(store.selectedShift._id, incidentReport._id)
                .then(updatedShift => {
                    setShift(updatedShift);
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
    }, [dispatch, store.selectedShift._id, incidentReport._id, store.selectedClient._id]);

    const handleAfterConfirmDeleteIncident = useCallback(() => {
        dispatch({
            type: "setSelectedIncidentReport",
            data: {}
        });
        dispatch({
            type: "setSelectedShift",
            data: shift
        });
        if (location.pathname.includes(`/incident-reports/${store.selectedIncidentReport._id}`)) {
            navigate("/calendar/shift-details/incident-reports", { replace: true });
        }
    }, [dispatch, shift, navigate, location.pathname, store.selectedIncidentReport._id]);

    const handleChildLoadState = useCallback((childIsLoading) => {
        setIsLoading(childIsLoading);
    }, []);

    const renderContent = useCallback(() => {
        if (Object.keys(incidentReport).length > 0) {
            if (!editMode) {
                return (
                    <>
                        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                            {incidentReport.incidentReportText}
                        </Typography>
                        {isEditable ?
                            <Stack direction="row" justifyContent="center" mt={4} gap={2}>
                                <ButtonPrimary onClick={toggleEditMode}
                                    sx={{ margin: "0" }} startIcon={<EditRoundedIcon />}>
                                    Edit
                                </ButtonPrimary>
                                <ButtonSecondary onClick={handleConfirmDeleteIncident}
                                    sx={{ margin: "0" }} startIcon={<DeleteForeverIcon />}>
                                    Delete
                                </ButtonSecondary>
                            </Stack>
                            : null}
                    </>
                );
            } else {
                return (
                    <>
                        <IncidentReportForm
                            hideSubmitButton
                            dontClear
                            setParentIsLoading={handleChildLoadState}
                            ref={formRef}
                            editMode={editMode}
                            setEditMode={setEditMode}
                        />
                        <Stack direction="row" justifyContent="center" mt={4} gap={2}>
                            <ButtonPrimary onClick={handleUpdateIncident} disabled={isLoading}
                                sx={{ margin: "0" }} startIcon={<TaskIcon />}>
                                Save
                            </ButtonPrimary>
                            <ButtonSecondary onClick={() => toggleEditMode(false)} disabled={isLoading}
                                sx={{ margin: "0" }} startIcon={<CancelIcon />}>
                                Cancel
                            </ButtonSecondary>
                        </Stack>
                    </>
                )
            }
        }
    }, [incidentReport, editMode, toggleEditMode, isEditable, isLoading,
        handleChildLoadState, handleConfirmDeleteIncident, handleUpdateIncident]);

    useEffect(() => {
        setIncidentReport(store.selectedIncidentReport);
    }, [store.selectedIncidentReport])

    useEffect(() => {
        setIsEditable(shiftUtils.userIsShiftCarer
            && (shiftUtils.isInProgress || shiftUtils.isInEditWindow));
    }, [shiftUtils]);

    return (
        <>
            <Fade in={true}>
                <Stack direction="row" alignItems="flex-end">
                    <Typography variant="h3">Incident Report {incidentReportIndex}</Typography>
                    {Object.keys(incidentReport).length > 0 ? (
                        <ButtonDownload
                            tooltip="Download Incident Report"
                            filename="Incident Report"
                            resourceURL={incidentReport.incidentReportPDF}
                        />
                    ) : null}
                </Stack>
            </Fade>
            <Grow in={true}>
                <Box sx={{ pt: 1 }}>
                    {renderContent()}
                </Box>
            </Grow>
            <Confirmation
                modalId={modalId}
                title="Confirm delete incident"
                text="Are you sure you want to delete this incident report? It will be permanently removed from the shift."
                callback={handleDeleteIncident}
                cancelText="Keep incident"
                confirmText={<><DeleteForeverIcon />Delete</>}
                successAlert="The incident report was successfully deleted."
                stayOpenOnConfirm
                afterConfirm={handleAfterConfirmDeleteIncident}
            >
                {Object.keys(store.selectedIncidentReport).length > 0 ?
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        <span style={{ fontSize: "1.7rem", lineHeight: "100%", verticalAlign: "sub", color: theme.palette.primary.main }}>&ldquo; </span>
                        {incidentReport.incidentReportText.length <= 140 ?
                            incidentReport.incidentReportText
                            : <>{incidentReport.incidentReportText.slice(0, 140)} ...</>
                        }
                        <span style={{ fontSize: "1.7rem", lineHeight: "100%", verticalAlign: "sub", color: theme.palette.primary.main }}> &rdquo;</span>
                    </Typography>
                    : null}
            </Confirmation>
        </>
    )
}

export default IncidentReportDetails