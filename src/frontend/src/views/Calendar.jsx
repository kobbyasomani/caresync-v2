import { useState, useEffect, useCallback } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useGlobalState } from "../utils/globalStateContext";
import baseURL from "../utils/baseUrl";

import { Typography, Stack, Box } from "@mui/material"

import SelectedPatient from "../components/SelectedPatient";
import Shift from "../components/Shift";
import CalendarDayGrid from "../components/CalendarDayGrid";

export const Calendar = () => {
    const { store, dispatch } = useGlobalState();
    const patient = store.selectedPatient;
    const [patientShifts, setPatientShifts] = useState([]);

    const navigate = useNavigate();

    // Fetch all patient shifts
    useEffect(() => {
        fetch(`${baseURL}/patient/${patient._id}`)
            .then(response => response.json())
            .then((shifts) => setPatientShifts(shifts));
    }, [patient._id]);

    // console.log(patientShifts);

    return (
        patient ? (
            <>
                <SelectedPatient patient={patient} />

                <Box id="calendar">
                    <CalendarDayGrid />
                </Box>


                <section>
                    <Typography variant="h3">Upcoming Shift</Typography>
                    <Shift featured />
                </section>

                <section>
                    <Typography variant="h3">Recent Shifts</Typography>
                    <Stack spacing={2}>
                        <Shift />
                        <Shift />
                    </Stack>

                </section>
            </>
        ) : (
            null
        )
    );
}

export default Calendar;
