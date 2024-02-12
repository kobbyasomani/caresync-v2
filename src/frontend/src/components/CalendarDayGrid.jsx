import { React, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../utils/globalUtils";
import { useModalContext } from "../utils/modalUtils";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar//list";
import interactionPlugin from "@fullcalendar/interaction";


const CalendarDayGrid = () => {
    // Selected date information state manager
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const navigate = useNavigate();
    const [calendarView, setCalendarView] = useState({
        view: "dayGridMonth",
        toggleText: "List view",
    });
    const calendarRef = useRef(null);

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

    const toggleCalendarView = () => {
        setCalendarView(prev => {
            const toggleText = prev.toggleText === "Grid view" ? "List view" : "Grid view";
            const view = prev.view === "dayGridMonth" ? "list" : "dayGridMonth"

            calendarRef.current.getApi().changeView(view);
            return {
                view: view,
                toggleText: toggleText
            }
        });
    };

    return (
        <>
            <FullCalendar
                ref={calendarRef}
                editable
                selectable
                select={handleSelect}
                eventClick={handleEventClick}
                selectLongPressDelay={300}
                aspectRatio={1}
                // contentHeight="auto"
                expandRows={true}
                titleFormat={{ year: "numeric", month: "short" }}
                plugins={[
                    dayGridPlugin,
                    listPlugin,
                    interactionPlugin
                ]}
                initialView={calendarView.view}
                customButtons={{
                    toggleView: {
                        text: calendarView.toggleText,
                        click: toggleCalendarView
                    }
                }}
                headerToolbar={{
                    start: "prev",
                    center: "title",
                    end: "today toggleView next"
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