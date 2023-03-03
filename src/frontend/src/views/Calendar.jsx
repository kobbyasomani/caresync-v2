import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { useGlobalContext } from "../utils/globalUtils";
import baseURL from "../utils/baseUrl";

import { Typography, Stack, Box } from "@mui/material"

import SelectedPatient from "../components/SelectedPatient";
import Shift from "../components/Shift";
import CalendarDayGrid from "../components/CalendarDayGrid";
import Modal from "../components/Modal";
import ShiftDetails from "../components/shift-details/ShiftDetails";

export const Calendar = () => {
    const { store, dispatch } = useGlobalContext();
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all patient shifts and add them to state
    useEffect(() => {
        //         console.log(`selected patient: ${store.selectedPatient.firstName} \
        // ${store.selectedPatient.lastName}`);
        //Find the first shift after the current date
        fetch(`${baseURL}/shift/${store.selectedPatient._id}`, {
            credentials: "include"
        }).then(response => response.json())
            .then((shifts) => {
                // console.log(shifts);
                dispatch({
                    type: "setShifts",
                    data: shifts
                });
                setIsLoading(false);
            });
    }, [store.selectedPatient, dispatch]);

    // Set the featured shift (closest upcoming)
    useEffect(() => {
        if (Object.keys(store.shifts).length === 0) {
            return
        }
        const findUpcomingShift = () => {
            // console.log("Finding upcoming shift...");
            let upcomingShift = null;
            // console.log(`shifts: `, shifts);
            for (const shift of store.shifts) {
                const shiftDate = new Date(shift.shiftStartTime);
                // console.log("shift date: ", shiftDate);
                const now = new Date();
                // console.log("date now: ", now);
                if (shiftDate > now && upcomingShift === null) {
                    // console.log(`${shiftDate} added as featured shift`);
                    upcomingShift = shift;
                }
                if (shiftDate > now && shiftDate < upcomingShift) {
                    // console.log(`${shiftDate} added as featured shift`);
                    upcomingShift = shift;
                }
            }
            if (upcomingShift) {
                // console.log(`upcoming shift: ${upcomingShift.shiftStartTime}`);
                return upcomingShift;
            } else {
                // console.log("No upcoming shift found");
                return {};
            }
        }
        const featuredShift = findUpcomingShift();
        dispatch({
            type: "setFeaturedShift",
            data: featuredShift
        });
    }, [store.shifts, store.selectedPatient, dispatch]);

    // Set the previous shifts (previous two shifts before today)
    useEffect(() => {
        if (Object.keys(store.shifts).length === 0) {
            return
        }
        const findPreviousShifts = () => {
            // console.log("Finding previous shifts...");
            let shifts = [...store.shifts];
            if (shifts.length > 1) {
                shifts = [...store.shifts].reverse();
            }
            let prevShifts = [];
            // console.log(`shifts: `, shifts);
            for (let i = 0; i < shifts.length; i++) {
                const shift = shifts[i];
                // console.log(`shift: `, shift);
                const shiftDate = new Date(shift.shiftStartTime);
                // console.log("shift date: ", shiftDate);
                const now = new Date();
                // console.log("date now: ", now);
                if (shiftDate < now) {
                    // console.log(`${shiftDate} added to prevShifts`);
                    prevShifts.push(shift)
                }
            }
            if (prevShifts.length > 0) {
                // console.log("prevShifts: ", prevShifts);
                return prevShifts;
            } else {
                // console.log("No previous shifts found");
                return [];
            }
        }
        const prevShifts = findPreviousShifts();
        dispatch({
            type: "setPreviousShifts",
            data: prevShifts
        });
    }, [store.shifts, store.selectedPatient, dispatch]);

    // console.log(store.featuredShift.shiftStartTime);

    return isLoading ? null : (
        store.selectedPatient && store.shifts ? (
            <>
                <SelectedPatient />

                <Box id="calendar">
                    <CalendarDayGrid />
                </Box>

                {Object.keys(store.featuredShift).length > 0 ? (
                    <section>
                        <Typography variant="h3" sx={{ mb: 1 }}>Upcoming Shift</Typography>
                        <Shift featured shift={store.featuredShift} />
                    </section>
                ) : (
                    <section>
                        <Typography variant="h3">No upcoming shifts</Typography>
                    </section>
                )}

                {store.previousShifts.length > 0 ? (
                    <section>
                        <Typography variant="h3">Recent Shifts</Typography>
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            {store.previousShifts.map(shift => {
                                return <Shift key={shift._id} shift={shift} />
                            })}
                        </Stack>
                    </section>
                ) : (
                    <Typography variant="h3">No Recent Shifts</Typography>
                )}

                <Modal>
                    <Outlet />
                </Modal>

                <ShiftDetails isLoading={isLoading} />
            </>
        ) : null
    );
}

export default Calendar;
