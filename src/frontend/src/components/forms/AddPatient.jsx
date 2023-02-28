import { useState, useCallback, navigate } from "react";
import { Link } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import { useHandleForm } from "../../utils/formUtils";
import { useSetModal, useModalContext } from "../../utils/modalUtils";
import Form from "./Form";
import { ButtonPrimary, ButtonSecondary, ActionButtonGroup } from "../root/Buttons";

import { TextField, Alert } from "@mui/material";

export const AddPatient = () => {
    // console.log("rendering AddPatient");

    const { dispatch } = useGlobalContext();

    // Set the form state
    const initialState = {
        inputs: {
            firstName: "",
            lastName: "",
        },
        errors: []
    }
    const [form, setForm] = useHandleForm(initialState);

    // Alert state
    const [alerts, setAlerts] = useState([]);

    const setNewPatient = useCallback((patient) => {
        // console.log("setting new patient...");
        // Show success alert
        setAlerts(prev => [...prev, `Patient ${patient.firstName} ${patient.lastName} 
    was added. You can now coordinate their care using the calendar.`]);

        // Set the selectedPatient to newly created patient
        dispatch({
            type: "setSelectedPatient",
            data: patient
        });
    }, [dispatch]);

    const switchPatient = useCallback(() => {
        dispatch({
            type: "setSelectedPatient",
            data: ""
        });
        navigate("/");
    }, [dispatch]);

    // Close the modal when navigating to the calendar
    const { modalDispatch } = useModalContext();
    const closeModal = useCallback(() => {
        modalDispatch({
            type: "close",
            data: "modal"
        });
    });

    return (
        <>
            <Form
                form={form}
                setForm={setForm}
                legend="New patient"
                buttonText="Add patient"
                postURL="/patient"
                callback={setNewPatient}
            >
                <TextField
                    label="First name"
                    id="first-name"
                    type="text"
                    name="firstName"
                    placeholder="Jane"
                    required
                    mui="TextField" />
                <TextField
                    label="Last name"
                    id="last-name"
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    required
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
                        <ActionButtonGroup>
                            <Link to="/" onClick={switchPatient} className="button-link">
                                <ButtonSecondary>
                                    Back to patients
                                </ButtonSecondary>
                            </Link>
                            <Link to="/calendar" onClick={closeModal} className="button-link">
                                <ButtonPrimary>
                                    View calendar
                                </ButtonPrimary>
                            </Link>
                        </ActionButtonGroup>
                    </div>
                </div>
            ) : (
                null
            )}
        </>
    )
}

export default AddPatient;
