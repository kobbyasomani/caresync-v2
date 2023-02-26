import { useState, useEffect, useCallback } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useGlobalState } from "../utils/globalStateContext";
import baseURL from "../utils/baseUrl";

import { Typography, Stack } from "@mui/material"
import SelectedPatient from "../components/SelectedPatient";
import Shift from "../components/Shift";

export const Calendar = () => {
    // console.log("rendering Calendar");

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

                <div id="calendar">Calendar goes here</div>

                <section>
                    <Typography variant="h2">Upcoming Shift</Typography>
                    <Shift featured />
                </section>

                <section>
                    <Typography variant="h2">Recent Shifts</Typography>
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
