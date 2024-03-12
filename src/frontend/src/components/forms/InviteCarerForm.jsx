import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import { useHandleForm } from "../../utils/formUtils";
import { useModalContext } from "../../utils/modalUtils";
import Form from "./Form";
import { ButtonPrimary, ButtonSecondary } from "../root/Buttons";
import Modal from "../Modal";

import { TextField, Alert } from "@mui/material";

export const InviteCarerForm = () => {
    const { store } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const modalId = "invite-carer";
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

    // Close the modal
    const handleCloseModal = useCallback(() => {
        modalDispatch({
            type: "close",
            data: "modal",
            id: modalId
        });
        navigate("/calendar")
    }, [modalDispatch, navigate]);

    const handleReturnToCareTeam = useCallback(() => {
        modalDispatch({
            type: "close",
            data: "modal",
            id: modalId
        });
        modalDispatch({
            type: "open",
            data: "modal",
            id: "care-team-list"
        });
        navigate("/calendar/care-team")
    }, [modalDispatch, navigate]);

    return (
        <Modal modalId={modalId}
            title="Invite a care team member"
            text={`Send an invitation to another user to join ${store.selectedClient.firstName} 
    ${store.selectedClient.lastName}'s care team. The user must have an existing 
    CareSync account that uses the same email address.`}
            hasEndpoint
        >
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
            <ButtonSecondary onClick={handleReturnToCareTeam}>
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
                    <ButtonPrimary onClick={handleCloseModal}>
                        Close
                    </ButtonPrimary>
                </div>
            ) : (
                null
            )}
        </Modal>
    )
}

export default InviteCarerForm;
