import { useCallback, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import Incident from "./Incident";

import { ButtonPrimary } from "../root/Buttons";
import { Typography, Stack, Box, Fade, Grow, Breadcrumbs } from "@mui/material";
import ReportRoundedIcon from "@mui/icons-material/ReportRounded";

const IncidentReports = () => {
    const { store, dispatch } = useGlobalContext();
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
        dispatch({
            type: "clearSelectedIncidentReport"
        });
    }, [store.selectedShift, dispatch]);

    return (
        <>
            <Fade in={true}>
                <Box>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link to="/calendar/shift-details/">Shift details</Link>
                        <Typography>Incidents</Typography>
                    </Breadcrumbs>
                    <Typography variant="h3" mt={3}>Incident Reports</Typography>
                </Box>
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