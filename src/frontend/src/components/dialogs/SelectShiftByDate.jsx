import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { compareDates, dateAsObj, minusHours } from "../../utils/dateUtils";

import Shift from "../Shift";
import { ButtonPrimary } from "../root/Buttons";

import { Stack } from "@mui/material";
import MoreTimeIcon from '@mui/icons-material/MoreTime';

const SelectShiftByDate = () => {
    // Get all shifts that fall on a given date from the store
    const { store } = useGlobalContext();
    const { modalStore, modalDispatch } = useModalContext();
    const [shifts, setShifts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getShiftsForDate = () => {
            const shifts = store.shifts;
            const selected = store.selectedDate;
            let shiftsForDate = [];
            for (const shift of shifts) {
                const datesAreEqual = compareDates(
                    dateAsObj(shift.shiftStartTime), dateAsObj(selected.start));
                if (datesAreEqual) {
                    shiftsForDate.push(shift);
                }
            }
            return shiftsForDate;
        }
        setShifts(getShiftsForDate());
    }, [modalDispatch, modalStore.activeModal, store.selectedDate, store.shifts]);

    useEffect(() => {
        if (shifts.length === 0) {
            modalDispatch({
                type: "setActiveModal",
                data: {
                    title: `Shifts for ${new Date(store.selectedDate.start).toLocaleDateString()}`,
                    text: "There are no shifts for this date."
                }
            })
        } else {
            // Set the shift selection modal title and text
            modalDispatch({
                type: "setActiveModal",
                data: {
                    title: `Shifts for ${new Date(store.selectedDate.start).toLocaleDateString()}`,
                    text: `Select a shift to view or edit its handover, 
shift notes, and incident reports.`
                }
            });
        }
    }, [modalDispatch, modalStore.activeModal.title, shifts.length, store.selectedDate])

    const addShift = useCallback(() => {
        navigate("/calendar/add-shift");
    }, [navigate]);

    return (
        <>
            {shifts.length > 0 ? (
                <Stack spacing={2}>
                    {shifts.map(shift => {
                        return <Shift key={shift._id} shift={shift} />
                    })}
                </Stack>

            ) : (
                null
            )}
            {store.selectedPatient.coordinator === store.user._id
                //Hide the 'add shift' button on past days
                && dateAsObj(store.selectedDate.start) > minusHours(new Date(), 24) ? (
                <ButtonPrimary startIcon={<MoreTimeIcon />} onClick={addShift}>
                    Add Shift
                </ButtonPrimary>
            ) : null}
        </>
    )
}

export default SelectShiftByDate