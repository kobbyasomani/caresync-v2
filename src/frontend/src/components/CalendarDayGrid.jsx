import React from "react";
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import Modal from "./Modal";
import SelectShiftByDate from "./dialogs/SelectShiftByDate";

const CalendarDayGrid = () => {
    // Selected date information state manager
    const [dateInfo, setDateInfo] = useState({});

    // Modal state manager
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (info) => {
        // console.log(info);
        setDateInfo(info);
        setIsOpen(true);
    }

    return (
        <>
            <FullCalendar
                editable
                selectable
                select={handleSelect}
                selectLongPressDelay={300}
                aspectRatio={1.0}
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
                data-testid="calendar"
            />
            <Modal title={`Shifts for ${new Date(dateInfo.start).toLocaleDateString()}`}
                text="Select a shift to view or edit its handover, shift notes, and incident reports."
                state={{ isOpen, setIsOpen }}
                data-testid="modal"
            >
                <SelectShiftByDate />
            </Modal>
        </>

    );
}

export default CalendarDayGrid;