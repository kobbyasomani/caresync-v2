import React from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../utils/globalUtils";
import { useModalContext } from "../utils/modalUtils";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";


const CalendarDayGrid = () => {
    // Selected date information state manager
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const navigate = useNavigate();

    // Handle selecting a calendar day
    const handleSelect = (info) => {
        // Set the selected date in the calendar state
        dispatch({
            type: "setSelectedDate",
            data: info
        });
        // Open the modal
        modalDispatch({
            type: "open",
            data: "modal"
        });
        // Navigate to Select Shift by Date
        navigate("/calendar/select-shift-by-date")
    }

    // Handle clicking a on a calendar event
    const handleEventClick = (eventClickInfo) => {
        eventClickInfo.jsEvent.preventDefault();
        // Get the full shift data stored in the event
        const shift = eventClickInfo.event.extendedProps.fullShift;

        dispatch({
            type: "setSelectedShift",
            data: shift
        });
        modalDispatch({
            type: "open",
            data: "drawer"
        });
    }

    return (
        <>
            <FullCalendar
                editable
                selectable
                select={handleSelect}
                eventClick={handleEventClick}
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
                events={store.shifts.map(shift => {
                    return {
                        id: shift._id,
                        title: `${shift.carer.firstName} ${shift.carer.lastName}`,
                        start: shift.shiftStartTime,
                        end: shift.shiftEndTime,
                        display: "auto",
                        fullShift: shift
                    }
                })}
                eventTimeFormat={{
                    hour: "numeric",
                    meridiem: "short"
                }}
                eventColor="#79589fff"
                data-testid="calendar"
            />
        </>
    );
}

export default CalendarDayGrid;