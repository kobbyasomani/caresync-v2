import { useState, useEffect, useReducer } from "react";
import { Outlet } from "react-router-dom";

import { useGlobalState } from "../utils/globalStateContext";
import { useModalContext } from "../utils/modalUtils";
import { CalendarContext, useCalendarContext, calendarReducer } from "../utils/calendarUtils";
import baseURL from "../utils/baseUrl";

import { Typography, Stack, Box } from "@mui/material"

import SelectedPatient from "../components/SelectedPatient";
import Shift from "../components/Shift";
import CalendarDayGrid from "../components/CalendarDayGrid";
import Modal from "../components/Modal";
import SelectShiftByDate from "../components/dialogs/SelectShiftByDate";
import ShiftDetails from "../components/ShiftDetails";
import { useModalReducer, useSetModal, useSetDrawer } from "../utils/modalUtils";

export const Calendar = () => {
    // Patient data and shifts state handlers
    const { store } = useGlobalState();
    const patient = store.selectedPatient;
    const [patientShifts, setPatientShifts] = useState([]);

    // Context store for the calendar view
    const [calStore, calDispatch] = useReducer(calendarReducer, {
        selectedDate: {},
    });
    // console.log(calStore);

    // Get the state and context manager for modal/drawer
    const { modalStore, modalDispatch } = useModalContext();

    // Fetch all patient shifts
    useEffect(() => {
        fetch(`${baseURL}/patient/${patient._id}`, {
            credentials: "include"
        })
            .then(response => response.json())
            .then((shifts) => setPatientShifts(shifts));
    }, [patient._id]);

    // console.log(patientShifts);

    return (
        patient ? (
            <CalendarContext.Provider value={{ calStore, calDispatch }}>
                <SelectedPatient patient={patient} />

                <Box id="calendar">
                    <CalendarDayGrid
                        modalStore={modalStore}
                        modalDispatch={modalDispatch} />
                </Box>

                <section>
                    <Typography variant="h3">Upcoming Shift</Typography>
                    <Shift featured dispatch={modalDispatch} />
                </section>

                <section>
                    <Typography variant="h3">Recent Shifts</Typography>
                    <Stack spacing={2}>
                        <Shift />
                        <Shift />
                    </Stack>
                </section>

                <Modal
                // title={`Shifts for ${calStore.selectedDate ?
                //     new Date(calStore.selectedDate.start).toLocaleDateString()
                //     : null}`}
                // text="Select a shift to view or edit its handover, 
                // shift notes, and incident reports."
                >
                    <Outlet />
                    {/* <SelectShiftByDate /> */}
                </Modal>

                <ShiftDetails isOpen={modalStore.drawerIsOpen} shift />
            </CalendarContext.Provider>
        ) : (
            null
        )
    );
}

export default Calendar;
