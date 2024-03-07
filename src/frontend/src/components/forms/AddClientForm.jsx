import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import { useHandleForm } from "../../utils/formUtils";
import { useModalContext } from "../../utils/modalUtils";
import Form from "./Form";
import { ButtonPrimary, ButtonSecondary, ActionButtonGroup } from "../root/Buttons";

import { TextField, Alert } from "@mui/material";

export const AddClient = () => {
    // console.log("rendering AddClient");
    const navigate = useNavigate();

    const { dispatch } = useGlobalContext();

    // Set the inital form state
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

    const setNewClient = useCallback((client) => {
        // Show success alert
        setAlerts(prev => [...prev, `Client ${client.firstName} ${client.lastName} 
    was added. You can now coordinate their care using the calendar.`]);

        // Set the selectedClient to newly created client
        dispatch({
            type: "setSelectedClient",
            data: client
        });
    }, [dispatch]);

    const handleSwitchClient = useCallback(() => {
        dispatch({
            type: "setSelectedClient",
            data: ""
        });
        modalDispatch({
            type: "close",
            data: "modal"
        });
        navigate("/");
    }, [dispatch, navigate]);

    // Close the modal when navigating to the calendar
    const { modalDispatch } = useModalContext();
    const handleCloseModal = useCallback(() => {
        modalDispatch({
            type: "close",
            data: "modal"
        });
    }, [modalDispatch]);

    return (
        <>
            <Form form={form}
                setForm={setForm}
                legend="New client"
                buttonText="Add client"
                postURL="/client"
                callback={setNewClient}
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
                            <Link to="/" onClick={handleSwitchClient} className="button-link">
                                <ButtonSecondary>
                                    Back to clients
                                </ButtonSecondary>
                            </Link>
                            {/* //TODO: Fix bug when attempting to access calendar with no shifts for the first time */}
                            <Link to="/calendar" onClick={handleCloseModal} className="button-link">
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

export default AddClient;
