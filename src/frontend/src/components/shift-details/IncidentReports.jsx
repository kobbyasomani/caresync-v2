import { useCallback } from "react";
import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import Incident from "./Incident";

import { ButtonPrimary } from "../root/Buttons";
import { Typography, Stack, Box } from "@mui/material";

const IncidentReports = () => {
    const { store } = useGlobalContext();
    const { modalDispatch } = useModalContext();

    const createIncidentReport = useCallback(() => {
        modalDispatch({
            type: "setActiveDrawer",
            data: "create incident report"
        })
    }, [modalDispatch]);

    return (
        <>
            <Typography variant="h3" component="p">Incident Reports</Typography>
            <Box sx={{ mt: 1 }}>
                {store.selectedShift.incidentReports.length > 0 ? (
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        {store.selectedShift.incidentReports.map((incident, index) => {
                            return <Incident key={incident._id} incident={incident} index={index + 1} />
                        })}
                    </Stack>
                ) : (
                    <Typography variant="body1">
                        There are no incident reports for this shift.
                    </Typography>
                )}
                {store.user._id === store.selectedShift.carer._id
                    && new Date(store.selectedShift.shiftEndTime) > new Date() ? (
                    <ButtonPrimary onClick={createIncidentReport}>
                        Create Incident Report
                    </ButtonPrimary>
                ) : null}
            </Box>
        </>
    )
}

export default IncidentReports