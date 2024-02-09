import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCarers } from "../../utils/apiUtils";

import { useGlobalContext } from "../../utils/globalUtils";
import { useHandleForm } from "../../utils/formUtils";
import { useModalContext } from "../../utils/modalUtils";
import Form from "./Form";
import { ButtonPrimary } from "../root/Buttons";
import Loader from "../logo/Loader";

import {
    TextField, Alert, Stack,
    FormControl, Select, InputLabel, MenuItem
} from "@mui/material";
import TimePicker from "../DateTimePicker";
import dayjs from "dayjs";
import baseURL from "../../utils/baseUrl";


export const EditShiftForm = () => {
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Set the initial form and alert state
    const initialState = {
        inputs: {
            carer: store.selectedShift.carer._id,
            shiftStartTime: dayjs(new Date(store.selectedShift.shiftStartTime)).$d,
            shiftEndTime: dayjs(new Date(store.selectedShift.shiftEndTime)).$d,
            coordinatorNotes: store.selectedShift.coordinatorNotes
        },
        errors: []
    }
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
            name: "carer",
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
        // Shift can only be edited if it is still in progress
        if (form.inputs.shiftStartTime < new Date()
            && (new Date(store.selectedShift.shiftEndTime) < new Date())) {
            throw new Error("Past shifts cannot be edited.")
        }
        // Shift end time cannot be in the past
        if (form.inputs.shiftEndTime < new Date()) {
            throw new Error("Shift end time cannot be in the past.")
        }
    }, [store.selectedShift.shiftEndTime]);

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

                // Set the updated shift as the selected shift
                dispatch({
                    type: "setSelectedShift",
                    data: shift
                });

                // Show success alert
                setAlerts(prev => [...prev, `The shift was successfully updated.`]);

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

    // console.log(form);

    return isLoading ? <Loader /> : (
        <>
            <Form form={form}
                setForm={setForm}
                legend="Update shift details"
                buttonText="Update shift"
                postURL={`/shift/${store.selectedShift._id}`}
                method="PUT"
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
                        // Cannot change the start time of an already-commenced shift
                        disabled={new Date(store.selectedShift.shiftStartTime) < new Date()}
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
                        value={form.inputs.carer}
                        name="carer"
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

export default EditShiftForm;
