import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import Incident from "./Incident";

import { ButtonPrimary } from "../root/Buttons";
import { Typography, Stack, Box, Fade, Grow } from "@mui/material";
import ReportRoundedIcon from "@mui/icons-material/ReportRounded";

const IncidentReports = () => {
    const { store } = useGlobalContext();
    const { shiftUtils } = store;
    const [incidentReports, setIncidentReports] = useState(store.selectedShift.incidentReports);

    const navigate = useNavigate();

    const handleCreateIncidentReport = useCallback(() => {
        navigate("/calendar/shift-details/incident-reports/create-incident-report");
    }, [navigate]);

    const renderContent = useCallback(() => {
        if (incidentReports.length > 0) {
            return (
                <Stack spacing={2} sx={{ pt: 1 }}>
                    {incidentReports.map((incident, index) => {
                        return <Incident
                            key={incident._id}
                            index={index + 1}
                            incident={incident}
                            shiftUtils={shiftUtils} />
                    })}
                </Stack>
            )
        }
        if (shiftUtils.userIsShiftCarer && shiftUtils.isPending) {
            return (
                < Typography variant="body1">
                    You'll be able to add incident reports once the shift starts.
                </Typography>
            );
        }
        return (
            <Typography variant="body1">
                There are no incident reports for this shift.
            </Typography>
        )
    }, [incidentReports, shiftUtils]);

    const renderAddReportButton = useCallback(() => {
        if (shiftUtils.userIsShiftCarer
            && (shiftUtils.isInProgress || shiftUtils.isInEditWindow)) {
            return (
                <ButtonPrimary onClick={handleCreateIncidentReport} startIcon={<ReportRoundedIcon />}>
                    Create Incident Report
                </ButtonPrimary >
            );
        }
    }, [handleCreateIncidentReport, shiftUtils]);

    useEffect(() => {
        setIncidentReports(store.selectedShift.incidentReports);
    }, [store.selectedShift]);

    return (
        <>
            <Fade in={true}>
                <Typography variant="h3">Incident Reports</Typography>
            </Fade>
            <Grow in={true}>
                <Box sx={{ mt: 1 }}>
                    {renderContent()}
                    {renderAddReportButton()}
                </Box>
            </Grow>
        </>
    )
}

export default IncidentReports