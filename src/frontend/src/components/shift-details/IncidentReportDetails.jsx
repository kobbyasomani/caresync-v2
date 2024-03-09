import React, { useState, useCallback, useRef, useEffect } from "react"

import IncidentReportForm from "../forms/IncidentReportForm";
import { ButtonPrimary, ButtonSecondary } from "../root/Buttons";

import { useGlobalContext } from "../../utils/globalUtils";
import { ButtonDownload } from "../root/Buttons";
import { Typography, Box, Stack } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TaskIcon from '@mui/icons-material/Task';
import CancelIcon from '@mui/icons-material/Cancel';

const IncidentReportDetails = ({ shiftUtils }) => {
    const { store } = useGlobalContext();
    const [incidentReport, setIncidentReport] = useState(store.selectedIncidentReport);
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef(null);
    const [isEditable, setIsEditable] = useState(shiftUtils.userIsShiftCarer
        && (shiftUtils.isInProgress || shiftUtils.isInEditWindow));

    const toggleEditMode = useCallback((override) => {
        setEditMode(override || !editMode);
    }, [editMode]);

    const handleUpdateIncident = useCallback(() => {
        formRef.current.click();
    }, [formRef]);

    const handleConfirmDeleteIncident = useCallback(() => {

    }, []);

    const handleChildLoadState = useCallback((childIsLoading) => {
        setIsLoading(childIsLoading);
    }, []);

    useEffect(() => {
        setIncidentReport(store.selectedIncidentReport);
    }, [store.selectedIncidentReport])

    useEffect(() => {
        setIsEditable(shiftUtils.userIsShiftCarer
            && (shiftUtils.isInProgress || shiftUtils.isInEditWindow));
    }, [shiftUtils]);

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
                                    sx={{ margin: "0" }} startIcon={<EditIcon />}>
                                    Edit incident
                                </ButtonPrimary>
                                {/* // TODO: Implement delete incident from Incident Report Details (see IncidentReports) */}
                                <ButtonSecondary onClick={handleConfirmDeleteIncident}
                                    sx={{ margin: "0" }} startIcon={<DeleteForeverIcon />}>
                                    Delete incident
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
                                Save incident
                            </ButtonPrimary>
                            <ButtonSecondary onClick={() => toggleEditMode(false)} disabled={isLoading}
                                sx={{ margin: "0" }} startIcon={<CancelIcon />}>
                                Cancel edit
                            </ButtonSecondary>
                        </Stack>
                    </>
                )
            }
        }

    }, [incidentReport, editMode, toggleEditMode, isLoading,
        handleChildLoadState, handleConfirmDeleteIncident, handleUpdateIncident]);

    return (
        <>
            <Stack direction="row" alignItems="flex-end">
                <Typography variant="h3" component="p">Incident Report</Typography>
                {Object.keys(incidentReport).length > 0 ? (
                    <ButtonDownload
                        tooltip="Download Incident Report"
                        filename="Incident Report"
                        resourceURL={incidentReport.incidentReportPDF}
                    />
                ) : null}
            </Stack>
            <Box sx={{ pt: 1 }}>
                {renderContent()}
            </Box>
        </>
    )
}

export default IncidentReportDetails