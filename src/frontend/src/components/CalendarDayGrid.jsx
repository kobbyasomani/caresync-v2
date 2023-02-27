import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCalendarContext } from "../utils/calendarUtils";
import { useModalContext } from "../utils/modalUtils";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarDayGrid = () => {
    // Selected date information state manager
    const { calStore, calDispatch } = useCalendarContext();
    const { modalStore, modalDispatch } = useModalContext();
    const navigate = useNavigate();

    const handleSelect = (info) => {
        // console.log(info);
        // Set the selected date in the calendar state
        calDispatch({
            type: "setSelectedDate",
            data: info
        });
        // Set the shift selection modal title and text
        modalDispatch({
            type: "setActiveModal",
            data: {
                title: `Shifts for ${new Date(calStore.selectedDate.start).toLocaleDateString()}`,
                text: "Select a shift to view or edit its handover, \
                        shift notes, and incident reports."
            }
        });
        // Open the modal
        modalDispatch({
            type: "open",
            data: "modal"
        });
        // Navigate to Select Shift by Date
        navigate("/calendar/select-shift-by-date")
        console.log(`update selectedDate: ${info.start}`);
    }

    // console.log(modalDispatch)

    return (
        <>
            <FullCalendar
                editable
                selectable
                select={handleSelect}
                selectLongPressDelay={300}
                // aspectRatio={1.0}
                // contentHeight="auto"
                expandRows={true}
                titleFormat={{ year: "numeric", month: "short" }}
                plugins={[
                    dayGridPlugin,
                    interactionPlugin
                ]}
                headerToolbar={{
                    start: "prev",
                    center: "title",
                    end: "today next"
                }}
            />
        </>
    );
}

export default CalendarDayGrid;