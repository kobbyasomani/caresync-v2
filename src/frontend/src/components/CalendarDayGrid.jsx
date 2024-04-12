import { React, forwardRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../utils/globalUtils";
import { useModalContext } from "../utils/modalUtils";
import { getYearMonthDay, minusHours } from "../utils/dateUtils";

import { styled } from "@mui/material";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar//list";
import interactionPlugin from "@fullcalendar/interaction";

const StyleWrapper = styled('div')(({ theme }) => ({
    "& .fc-toolbar-title": {
        [theme.breakpoints.down("sm")]: {
            fontSize: "1.25rem",
        }
    },
    "& .fc-button": {
        [theme.breakpoints.down("sm")]: {
            padding: "0.15rem 0.3rem"
        }
    }
}));

const CalendarDayGrid = forwardRef(({ calendarApi, calendarView, toggleCalendarView,
    setAddShiftFormTrigger }, ref) => {
    // Selected date information state manager
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const navigate = useNavigate();

    // Handle selecting a calendar day
    const handleSelect = useCallback((info) => {
        // Set the selected date in the calendar state
        dispatch({
            type: "setSelectedDate",
            data: info
        });
        setAddShiftFormTrigger("calendar");
        // Open the modal
        modalDispatch({
            type: "open",
            data: "modal",
            id: "select-shift-by-date"
        });
    }, [dispatch, modalDispatch, setAddShiftFormTrigger]);

    // Handle clicking a on a calendar event
    const handleEventClick = useCallback((eventClickInfo) => {
        eventClickInfo.jsEvent.preventDefault();
        // Get the full shift data stored in the event
        const shift = eventClickInfo.event.extendedProps.fullShift;
        dispatch({
            type: "setSelectedShift",
            data: shift
        });
        navigate("/calendar/shift-details");
    }, [dispatch, navigate]);

    // Default the selected day to the current day
    useEffect(() => {
        if (Object.keys(store.selectedDate).length === 0) {
            const now = new Date();
            const nowPlusEightHours = minusHours(now, 8);
            const startDate = `${getYearMonthDay(nowPlusEightHours)}T${nowPlusEightHours.getHours().toString().padStart(2, "0")}:00:00.000Z`;
            dispatch({
                type: "setSelectedDate",
                data: { start: startDate }
            });
        }
    }, [calendarApi, dispatch, store.selectedDate]);

    return (
        <StyleWrapper>
            <FullCalendar
                ref={ref}
                editable={false}
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
                        title: `${shift.carer.firstName} ${calendarView.view === "listMonth" ? shift.carer.lastName
                            : shift.carer.lastName[0]}`,
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
                eventOrderStrict={true}
            />
        </StyleWrapper>
    );
});

export default CalendarDayGrid;