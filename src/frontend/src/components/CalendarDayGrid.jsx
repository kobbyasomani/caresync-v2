import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Box } from "@mui/material";

const CalendarDayGrid = () => {
    return (
        <FullCalendar
            plugins={
                [dayGridPlugin]
            }
        />
    );
}

export default CalendarDayGrid;