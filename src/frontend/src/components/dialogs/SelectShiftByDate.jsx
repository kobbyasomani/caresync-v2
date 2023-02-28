import { useEffect, useState } from "react";
import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { compareDates, dateAsObj } from "../../utils/dateUtils";

import Shift from "../Shift";
import { ButtonPrimary } from "../root/Buttons";

import { Stack } from "@mui/material";
import MoreTimeIcon from '@mui/icons-material/MoreTime';

const SelectShiftByDate = () => {
    // Get all shifts that fall on a given date from the store
    const { store } = useGlobalContext();
    const { modalStore, modalDispatch } = useModalContext();
    const [shifts, setShifts] = useState([]);

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
                    title: modalStore.activeModal.title,
                    text: "There are no shifts for this date."
                }
            })
        }
    }, [modalDispatch, modalStore.activeModal.title, shifts.length])

    return (
        shifts.length > 0 ? (
            <>
                <Stack spacing={2}>
                    {shifts.map(shift => {
                        return <Shift key={shift._id} shift={shift} />
                    })}
                </Stack>
                <ButtonPrimary startIcon={<MoreTimeIcon />}>
                    Add Shift
                </ButtonPrimary>
            </>
        ) : (
            null
        )
    )
}

export default SelectShiftByDate