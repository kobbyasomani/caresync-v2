import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import { useHandleForm } from "../../utils/formUtils";
import { useModalContext } from "../../utils/modalUtils";
import Form from "./Form";
import { ButtonPrimary, ButtonSecondary } from "../root/Buttons";

import { TextField, Alert } from "@mui/material";

export const InviteCarerForm = () => {
    const { store } = useGlobalContext();
    const { modalStore, modalDispatch } = useModalContext();
    const navigate = useNavigate();

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

    const invitationSent = useCallback(() => {
        // Show success alert
        setAlerts(prev => [...prev, `An email was sent to ${form.inputs.email} inviting 
        the user to join ${store.selectedClient.firstName} ${store.selectedClient.lastName}'s care team.`]);
    }, [form.inputs.email, store.selectedClient]);

    // Set modal text
    useEffect(() => {
        modalDispatch({
            type: "setActiveModal",
            data: {
                title: "Invite a care team member",
                text: `Send an invitation to another user to join ${store.selectedClient.firstName} 
                ${store.selectedClient.lastName}'s care team. The user must have an existing 
                CareSync account.`
            }
        })
    }, [modalDispatch, modalStore.activeModal, store.selectedClient]);

    // Close the modal
    const closeModal = useCallback(() => {
        modalDispatch({
            type: "close",
            data: "modal"
        });
        navigate("/calendar")
    }, [modalDispatch, navigate]);

    return (
        <>
            <Form form={form}
                setForm={setForm}
                legend="Invite a carer"
                buttonText="Send invitation"
                postURL={`/carer/invite/${store.selectedClient._id}`}
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
            <ButtonSecondary onClick={() => navigate(-1)}>
                Back to Care Team
            </ButtonSecondary>
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
                        Close
                    </ButtonPrimary>
                </div>
            ) : (
                null
            )}
        </>
    )
}

export default InviteCarerForm;
