import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";

/**
 * A time picker for selecting shift start and end times.
 * @param {string} label The label that appears a bove the time field
 * @returns A time picker (hours, minutes, AM/PM) with the given label.
 */
const TimePicker = ({ label, time, setTime, inputProps }) => {
    const pos = label === "Shift Start Time" ? "Start" : "End";
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileTimePicker
                label={label}
                value={time}
                onChange={(newTime) => setTime(pos, newTime)}
                renderInput={(params) => <TextField {...params} {...inputProps} />}
            />
        </LocalizationProvider>
    );
}

export default TimePicker