import { useCallback } from "react";
import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import Incident from "./Incident";

import { ButtonPrimary } from "../root/Buttons";
import { Typography, Stack, Box } from "@mui/material";

const IncidentReports = (props) => {
    const { store } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const { shiftUtils } = props;

    const createIncidentReport = useCallback(() => {
        modalDispatch({
            type: "setActiveDrawer",
            data: "create incident report"
        })
    }, [modalDispatch]);

    const renderContent = () => {
        if (store.selectedShift.incidentReports.length > 0) {
            return (
                <Stack spacing={2} sx={{ pt: 1 }}>
                    {store.selectedShift.incidentReports.map((incident, index) => {
                        return <Incident key={incident._id} incident={incident} index={index + 1} />
                    })}
                </Stack>
            )
        }
        if (shiftUtils.userIsCarer && shiftUtils.isPending) {
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
    };

    const renderAddReportButton = () => {
        if (shiftUtils.userIsCarer
            && (shiftUtils.isInProgress || shiftUtils.isInEditWindow)) {
            return (
                <ButtonPrimary onClick={createIncidentReport} >
                    Create Incident Report
                </ButtonPrimary >
            );
        }
    };

    return (
        <>
            <Typography variant="h3" component="p">Incident Reports</Typography>
            <Box sx={{ mt: 1 }}>
                {renderContent()}
                {renderAddReportButton()}
            </Box>
        </>
    )
}

export default IncidentReports