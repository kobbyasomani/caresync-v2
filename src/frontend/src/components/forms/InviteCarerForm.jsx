import { useState, useCallback, navigate } from "react";

import { useGlobalContext } from "../../utils/globalUtils";
import { useHandleForm } from "../../utils/formUtils";
import { useModalContext } from "../../utils/modalUtils";
import Form from "./Form";
import { ButtonPrimary } from "../root/Buttons";

import { TextField, Alert } from "@mui/material";

export const InviteCarerForm = () => {
    const { store } = useGlobalContext();
    const { modalDispatch } = useModalContext();

    // Set the inital form state
    const initialState = {
        inputs: {
            email: "",
        },
        errors: []
    }
    const [form, setForm] = useHandleForm(initialState);

    // Alert state
    const [alerts, setAlerts] = useState([]);

    const invitationSent = useCallback((patient) => {
        // Show success alert
        setAlerts(prev => [...prev, `An email was sent to ${form.inputs.email} inviting 
        the user to join ${store.selectedPatient.firstName} ${store.selectedPatient.lastName}'s care team.`]);
    }, [form.inputs.email, store.selectedPatient]);

    // Close the modal
    const closeModal = useCallback(() => {
        modalDispatch({
            type: "close",
            data: "modal"
        });
        navigate("/calendar")
    }, [modalDispatch]);

    return (
        <>
            <Form form={form}
                setForm={setForm}
                legend="Invite a carer"
                buttonText="Send invitation"
                postURL={`/carer/invite/${store.selectedPatient._id}`}
                callback={invitationSent}
            >
                <TextField
                    label="Email"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@provider.com"
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
                    <ButtonPrimary onClick={closeModal}>
                        Continue
                    </ButtonPrimary>
                </div>
            ) : (
                null
            )}
        </>
    )
}

export default InviteCarerForm;
