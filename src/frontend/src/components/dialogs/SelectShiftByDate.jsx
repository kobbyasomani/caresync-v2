import { useEffect, useState, useCallback } from "react";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { isSameDate, dateAsObj } from "../../utils/dateUtils";
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
    }, [modalDispatch]);

    useEffect(() => {
        populateModal();
    }, [store.selectedDate, populateModal]);

    return (
        <Modal modalId="select-shift-by-date"
            title={modalData.title}
            text={modalData.text}
            sx={{ zIndex: modalStore.drawerIsOpen ? 1100 : "1200" }}
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
            {store.selectedClient.isCoordinator
                && dateAsObj(store.selectedDate.start) >= new Date(new Date().setHours(0, 0, 0, 0)) ? (
                <ButtonPrimary startIcon={<MoreTimeIcon />} onClick={handleAddShift}>
                    Add Shift
                </ButtonPrimary>
            ) : null}
        </Modal>
    )
}

export default SelectShiftByDate