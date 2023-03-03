import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import baseURL from "../../utils/baseUrl";

import { useGlobalContext } from "../../utils/globalUtils";
import { useHandleForm } from "../../utils/formUtils";
import { useModalContext } from "../../utils/modalUtils";
import Form from "./Form";
import { ButtonPrimary } from "../root/Buttons";

import {
    TextField, Alert, Stack,
    FormControl, Select, InputLabel, MenuItem
} from "@mui/material";
import TimePicker from "../TimePicker";
import dayjs from "dayjs";
import { plusHours } from "../../utils/dateUtils";


export const AddShift = () => {
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Set the initial form and alert state
    const initialState = {
        inputs: {
            carerID: "",
            shiftStartTime: dayjs(plusHours(new Date(store.selectedDate.start), 7)).$d,
            shiftEndTime: dayjs(plusHours(new Date(store.selectedDate.start), 15)).$d,
            coordinatorNotes: ""
        },
        errors: []
    }
    const [form, setForm] = useHandleForm(initialState);
    const [alerts, setAlerts] = useState([]);
    const [carers, setCarers] = useState([]);

    // Get the carers for the selected patient
    const getCarers = useCallback(() => {
        fetch(`${baseURL}/patient/${store.selectedPatient._id}`, {
            credentials: "include"
        }).then((response => response.json()))
            .then((data) => {
                setCarers(data.patient.carers);
                setIsLoading(false);
            });
    }, [store.selectedPatient]);

    useEffect(() => {
        getCarers();
    }, [getCarers]);

    // Handle carer selection
    const selectCarer = useCallback((event) => {
        console.log(event.target)
        setForm({
            type: "setForm",
            name: "carerID",
            value: event.target.value
        });
    }, [setForm]);

    // Handle time selection
    const setShiftTime = useCallback((pos, newStartTime) => {
        console.log("setting time...");
        setForm({
            type: "setForm",
            name: `shift${pos}Time`,
            value: newStartTime.$d
        })
    }, []);

    // Update shifts after successfully posting new shift
    const updateShifts = useCallback((shift) => {
        // Update patient shifts from the database
        fetch(`${baseURL}/shift/${store.selectedPatient._id}`, {
            credentials: "include"
        }).then(response => response.json())
            .then((shifts) => {
                dispatch({
                    type: "setShifts",
                    data: shifts
                });

                // Set the newly created shift as the selected shift
                dispatch({
                    type: "setSelectedShift",
                    data: shifts[shifts.length - 1]
                });

                // Show success alert
                setAlerts(prev => [...prev, `A new shift for 
                ${store.selectedPatient.firstName} ${store.selectedPatient.lastName} 
                was added to ${new Date(shift.shiftStartTime).toLocaleDateString("en-AU", { dateStyle: "medium" })} 
                from ${new Date(shift.shiftStartTime).toLocaleTimeString("en-AU", { timeStyle: "short" })} 
                – ${new Date(shift.shiftEndTime).toLocaleTimeString("en-AU", { timeStyle: "short" })}.`]);

                // Finished loading
                setIsLoading(false);
            });
    }, [dispatch, store.selectedPatient]);

    // Close the modal and open the shift details drawer with the new shift
    const manageShift = useCallback(() => {
        modalDispatch({
            type: "close",
            data: "modal"
        });
        modalDispatch({
            type: "open",
            data: "drawer"
        });
    }, [modalDispatch]);

    // console.log(form);

    return isLoading ? null : (
        <>
            <Form form={form}
                setForm={setForm}
                legend="New shift details"
                buttonText="Create shift"
                postURL={`/shift/${store.selectedPatient._id}`}
                callback={updateShifts}
            >
                <label htmlFor="shiftStartTime" style={{ display: "none" }}>Shift Start Time</label>
                <label htmlFor="shiftEndTime" style={{ display: "none" }}>Shift End Time</label>
                <Stack spacing={2} sx={{ mt: 2, mb: 2 }}>
                    <TimePicker label="Shift Start Time"
                        inputProps={{ name: "shiftStartTime", required: true }}
                        time={form.inputs.shiftStartTime}
                        setTime={setShiftTime}
                    />
                    <TimePicker label="Shift End Time"
                        inputProps={{ name: "shiftEndTime", required: true }}
                        name="time-picker-end"
                        time={form.inputs.shiftEndTime}
                        setTime={setShiftTime}
                    />
                </Stack>
                <label htmlFor="carerID-input" style={{ display: "none" }}>Carer</label>
                <FormControl fullWidth>
                    <InputLabel id="carer-select">Select Carer</InputLabel>
                    <Select
                        labelId="carer-select"
                        id="carer-select"
                        label="Select Carer"
                        required
                        mui="Select"
                        value={form.inputs.carerID}
                        name="carerID"
                        onChange={selectCarer}
                        inputProps={{ id: "carerID-input" }}
                    >
                        {carers.map(carer => {
                            return (
                                <MenuItem value={carer._id} key={carer._id}>
                                    {`${carer.firstName} ${carer.lastName}`}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <TextField multiline
                    minRows={3}
                    label="Coordinator Notes"
                    id="coordinator-notes"
                    type="text"
                    name="coordinatorNotes"
                    placeholder="Some things to take note of during this shift are..."
                    mui="TextField" />
            </Form>
            {/* Display alerts */}
            {alerts.length > 0 ? (
                <div>
                    {alerts.map((alert, index) => {
                        return (
                            <Alert severity="success" key={index}>
                                {alert}
                            </Alert>
                        );
                    })}
                    < br />
                    <div className="journey-options">
                        <ButtonPrimary onClick={manageShift}>
                            Manage shift
                        </ButtonPrimary>
                    </div>
                </div>
            ) : (
                null
            )}
        </>
    )
}

export default AddShift;
