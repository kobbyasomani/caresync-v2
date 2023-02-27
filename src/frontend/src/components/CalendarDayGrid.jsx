import { useState } from "react";
import { useCalendarContext } from "../utils/calendarUtils";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarDayGrid = () => {
    // Selected date information state manager
    const { modalDispatch, calDispatch } = useCalendarContext();

    const handleSelect = (info) => {
        // console.log(info);
        calDispatch({
            type: "setSelectedDate",
            data: info
        });
        modalDispatch({
            type: "open",
            data: "modal"
        });
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