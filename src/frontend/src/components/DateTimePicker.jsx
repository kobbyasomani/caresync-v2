import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";

/**
 * A time picker for selecting shift start and end times.
 * @param {string} label The label that appears a bove the time field
 * @returns A time picker (hours, minutes, AM/PM) with the given label.
 */
const DateTimePicker = ({ label, time, setTime, inputProps, ...rest }) => {
    const pos = label === "Shift Start Time" ? "Start" : "End";
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker
                label={label}
                value={time}
                inputFormat="DD/MM/YYYY hh:mm A"
                mask="__/__/____ __:__ _M"
                onChange={(newTime) => setTime(pos, newTime)}
                renderInput={(params) => <TextField {...params} {...inputProps} />}
                {...rest}
            />
        </LocalizationProvider>
    );
}

export default DateTimePicker