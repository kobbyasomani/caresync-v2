import { useState, useCallback, useEffect, useNavigate } from "react";
import { Link } from "react-router-dom";
import baseURL from "../../utils/baseUrl";

import { useGlobalContext } from "../../utils/globalUtils";
import { useHandleForm } from "../../utils/formUtils";
import { useModalContext } from "../../utils/modalUtils";
import Form from "./Form";
import { ButtonPrimary } from "../root/Buttons";

import { TextField, Alert, FormControl, Select, InputLabel, MenuItem } from "@mui/material";

export const AddShift = () => {
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const [isLoading, setIsLoading] = useState(true);

    // Set the initial form and alert state
    const initialState = {
        inputs: {
            carerID: "",
            shiftStartTime: "",
            shiftEndTime: "",
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
        setForm({
            type: "setForm",
            name: "carerID",
            value: event.target.value
        })
    }, [setForm]);

    // Update shifts after posting new shift
    const setNewShift = useCallback((shift) => {
        // Update patient shifts from the database
        fetch(`${baseURL}/shift/${store.selectedPatient._id}`, {
            credentials: "include"
        }).then(response => response.json())
            .then((shifts) => {
                dispatch({
                    type: "setShifts",
                    data: shifts
                });
                // Show success alert
                setAlerts(prev => [...prev, `A new shift for ${store.selectedPatient.firstName} ${store.selectedPatient.lastName} 
        on ${shift.shiftStartTime} from ${shift.shiftStartTime} – ${shift.shiftEndTime} was added.`]);
                setIsLoading(false);
            });
    }, [dispatch, store.selectedPatient]);

    // Close the modal when navigating to the shift details drawer
    const manageShift = useCallback(() => {
        modalDispatch({
            type: "close",
            data: "modal"
        });
    }, [modalDispatch]);

    return isLoading ? null : (
        <>
            <Form form={form}
                setForm={setForm}
                legend="New shift details"
                buttonText="Create shift"
                postURL={`/shift/${store.selectedPatient._id}`}
                callback={setNewShift}
            >
                <FormControl fullWidth sx={{ mt: 2 }}>
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
                        <Link to="/calendar" onClick={manageShift}>
                            <ButtonPrimary>
                                Manage shift
                            </ButtonPrimary>
                        </Link>
                    </div>
                </div>
            ) : (
                null
            )}
        </>
    )
}

export default AddShift;
