import { useState, useEffect, useReducer } from "react";
import { useGlobalState } from "../utils/globalStateContext";
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

    // Modal and drawer state handlers
    const [modalState, modalDispatch] = useModalReducer({
        modalIsOpen: false,
        drawerlIsOpen: false
    });

    // Context store for the calendar view
    const [calStore, calDispatch] = useReducer(calendarReducer, {
        selectedDate: {},
    });
    // console.log(calStore);

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
            <CalendarContext.Provider value={{
                calStore,
                calDispatch,
                modalState,
                modalDispatch
            }}>
                <SelectedPatient patient={patient} />

                <Box id="calendar">
                    <CalendarDayGrid
                        modalState={modalState}
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
                    title={`Shifts for ${calStore.selectedDate ?
                        new Date(calStore.selectedDate.start).toLocaleDateString()
                        : null}`}
                    text="Select a shift to view or edit its handover, 
                    shift notes, and incident reports."
                    isOpen={modalState.modalIsOpen}
                    dispatch={modalDispatch}
                >
                    <SelectShiftByDate />
                </Modal>

                <ShiftDetails isOpen={modalState.drawerIsOpen}
                    shift />
            </CalendarContext.Provider>
        ) : (
            null
        )
    );
}

export default Calendar;
