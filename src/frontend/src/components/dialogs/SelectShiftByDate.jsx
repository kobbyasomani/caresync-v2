import { useEffect, useState } from "react";
import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { compareDates, dateAsObj } from "../../utils/dateUtils";

import Shift from "../Shift";
import { ButtonPrimary } from "../root/Buttons";

import { Stack, Typography } from "@mui/material";
import MoreTimeIcon from '@mui/icons-material/MoreTime';

const SelectShiftByDate = () => {
    // Get all shifts that fall on a given date from the store
    const { store, dispatch } = useGlobalContext();
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
            if (shiftsForDate.length === 0) {
                modalDispatch({
                    type: "setActiveModal",
                    data: {
                        ...modalStore.activeModal,
                        text: "There are no shifts for this date."
                    }
                })
            }
            return shiftsForDate;
        }
        setShifts(getShiftsForDate())
    }, []);

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