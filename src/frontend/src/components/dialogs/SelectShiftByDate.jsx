import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { isSameDate, dateAsObj, minusHours } from "../../utils/dateUtils";
import { ButtonPrimary } from "../root/Buttons";
import Modal from "../Modal";
import Shift from "../Shift";

import { Stack } from "@mui/material";
import MoreTimeIcon from '@mui/icons-material/MoreTime';

const SelectShiftByDate = () => {
    // Get all shifts that fall on a given date from the store
    const { store } = useGlobalContext();
    const { modalStore, modalDispatch } = useModalContext();
    const [modalData, setModalData] = useState({});
    const [shifts, setShifts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getShiftsForDate = () => {
            const shifts = store.shifts;
            const selected = store.selectedDate;
            let shiftsForDate = [];
            for (const shift of shifts) {
                const datesAreEqual = isSameDate(
                    dateAsObj(shift.shiftStartTime), dateAsObj(selected.start));
                if (datesAreEqual) {
                    shiftsForDate.push(shift);
                }
            }
            return shiftsForDate;
        }
        setShifts(getShiftsForDate());
    }, [modalDispatch, modalStore.activeModal, store.selectedDate, store.shifts]);

    const populateModal = useCallback(() => {
        if (shifts.length === 0) {
            setModalData({
                title: `Shifts for ${new Date(store.selectedDate.start).toLocaleDateString()}`,
                text: "There are no shifts for this date."
            });
        } else {
            // Set the shift selection modal title and text
            setModalData({
                title: `Shifts for ${new Date(store.selectedDate.start).toLocaleDateString()}`,
                text: `Select a shift to view or edit its handover, shift notes, and incident reports.`
            });
        }
    }, [shifts.length, store.selectedDate, setModalData])

    const handleAddShift = useCallback(() => {
        modalDispatch({
            type: "open",
            data: "modal",
            id: "add-shift"
        });
        navigate("/calendar/add-shift");
    }, [modalDispatch, navigate]);

    useEffect(() => {
        populateModal();
    }, [store.selectedDate, populateModal]);

    return (
        <Modal modalId="select-shift-by-date"
        title={modalData.title}
        text={modalData.text}
        hasEndpoint
        >
            {shifts.length > 0 ? (
                <Stack spacing={2}>
                    {shifts.map(shift => {
                        return <Shift key={shift._id} shift={shift} />
                    })}
                </Stack>
            ) : (
                null
            )}
            {store.selectedClient.coordinator._id === store.user._id
                //Hide the 'add shift' button on past days
                && dateAsObj(store.selectedDate.start) > minusHours(new Date(), 24) ? (
                <ButtonPrimary startIcon={<MoreTimeIcon />} onClick={handleAddShift}>
                    Add Shift
                </ButtonPrimary>
            ) : null}
        </Modal>
    )
}

export default SelectShiftByDate