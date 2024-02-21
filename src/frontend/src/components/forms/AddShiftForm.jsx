import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCarers } from "../../utils/apiUtils";

import { useGlobalContext } from "../../utils/globalUtils";
import { useHandleForm } from "../../utils/formUtils";
import { useModalContext } from "../../utils/modalUtils";
import { plusHours } from "../../utils/dateUtils";
import baseURL from "../../utils/baseUrl";
import Form from "./Form";
import { ButtonPrimary, ButtonAddCarer } from "../root/Buttons";
import Loader from "../logo/Loader";

import {
    TextField, Alert, Stack,
    FormControl, Select, InputLabel, MenuItem
} from "@mui/material";
import TimePicker from "../DateTimePicker";
import dayjs from "dayjs";


export const AddShiftForm = () => {
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Set the initial form and alert state
    const initialState = {
        inputs: new Date(store.selectedDate.start) > new Date() ? {
            carerID: "",
            shiftStartTime: dayjs(plusHours(new Date(store.selectedDate.start), 7)).$d,
            shiftEndTime: dayjs(plusHours(new Date(store.selectedDate.start), 15)).$d,
            coordinatorNotes: ""
        } : {
            carerID: "",
            shiftStartTime: dayjs(plusHours(new Date(), 7).setMinutes(0, 0, 0)).$d,
            shiftEndTime: dayjs(plusHours(new Date(), 15).setMinutes(0, 0, 0)).$d,
            coordinatorNotes: ""
        },
        errors: []
    };
    const [form, setForm] = useHandleForm(initialState);
    const [alerts, setAlerts] = useState([]);
    const [carers, setCarers] = useState([]);

    // Get the carers for the selected client
    useEffect(() => {
        getCarers(store.selectedClient._id).then(carers => {
            setCarers(carers);
            setIsLoading(false);
        });
    }, [store.selectedClient]);

    // Handle carer selection
    const selectCarer = useCallback((event) => {
        setForm({
            type: "setForm",
            name: "carerID",
            value: event.target.value
        });
    }, [setForm]);

    // Handle time selection
    const setShiftTime = useCallback((pos, newStartTime) => {
        setForm({
            type: "setForm",
            name: `shift${pos}Time`,
            value: newStartTime.$d
        })
    }, [setForm]);

    // Additional validation
    const validation = useCallback((form) => {
        // Shift must end after it starts
        if (form.inputs.shiftStartTime > form.inputs.shiftEndTime) {
            throw new Error("Shift end time cannot be before shift start time.")
        }
        // Shift must have a duration
        if (form.inputs.shiftStartTime.toLocaleString()
            === form.inputs.shiftEndTime.toLocaleString()) {
            throw new Error("Shift cannot have the same start time and end time.")
        }
        // New Shift cannot start in the past
        if (form.inputs.shiftStartTime < new Date()) {
            throw new Error("Shift start time cannot be in the past.")
        }
        // New Shift end time cannot be in the past
        if (form.inputs.shiftEndTime < new Date()) {
            throw new Error("Shift end time cannot be in the past.")
        }
    }, []);

    // Update shifts after successfully posting new shift
    const updateShifts = useCallback((shift) => {
        // Update client shifts from the database
        fetch(`${baseURL}/shift/${store.selectedClient._id}`, {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
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
                setAlerts(prev => [...prev, `A new shift was added for 
                ${store.selectedClient.firstName} ${store.selectedClient.lastName} on 
                ${new Date(shift.shiftStartTime).toLocaleDateString("en-AU", { dateStyle: "medium" })} 
                from ${new Date(shift.shiftStartTime).toLocaleTimeString("en-AU", { timeStyle: "short" })} 
                – ${new Date(shift.shiftEndTime).toLocaleTimeString("en-AU", { timeStyle: "short" })} 
                with carer ${shifts[shifts.length - 1].carer.firstName} ${shifts[shifts.length - 1].carer.lastName}.`]);

                // Finished loading
                setIsLoading(false);
            });
    }, [dispatch, store.selectedClient]);

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
        navigate("/calendar");
    }, [modalDispatch, navigate]);

    useEffect(() => {
        // Set shift creation modal text
        if (carers.length === 0) {
            // If the client has no assigned carers, prompt the user to invite some
            modalDispatch({
                type: "setActiveModal",
                data: {
                    title: "No carers assigned",
                    text: `It looks like this client doesn't have any carers assigned yet.
                Add some before creating a shift.`
                }
            });
        } else {
            modalDispatch({
                type: "setActiveModal",
                data: {
                    title: `New shift for ${new Date(store.selectedDate.start).toLocaleDateString()}`,
                    text: "Enter the details for a new shift on this date."
                }
            });
        }
    }, [modalDispatch, carers, store.selectedDate.start]);

    return isLoading ? <Loader /> : carers.length > 0 ? (
        <>
            <Form form={form}
                setForm={setForm}
                legend="New shift details"
                buttonText="Create shift"
                postURL={`/shift/${store.selectedClient._id}`}
                validation={validation}
                callback={updateShifts}
            >
                <label htmlFor="shiftStartTime" style={{ display: "none" }}>Shift Start Time</label>
                <label htmlFor="shiftEndTime" style={{ display: "none" }}>Shift End Time</label>
                <Stack spacing={2} sx={{ mt: 2, mb: 2 }}>
                    <TimePicker label="Shift Start Time"
                        inputProps={{ name: "shiftStartTime", required: true }}
                        time={form.inputs.shiftStartTime}
                        setTime={setShiftTime}
                        minDate={dayjs(new Date())}
                    />
                    <TimePicker label="Shift End Time"
                        inputProps={{ name: "shiftEndTime", required: true }}
                        name="time-picker-end"
                        time={form.inputs.shiftEndTime}
                        setTime={setShiftTime}
                        minDate={dayjs(new Date())}
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
    ) : (
        // If the client has no assigned carers, prompt the user to invite some
        <>
            <ButtonAddCarer />
        </>

    )
}

export default AddShiftForm;
