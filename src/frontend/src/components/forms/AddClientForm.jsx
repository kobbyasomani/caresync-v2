import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import { useHandleForm } from "../../utils/formUtils";
import { useModalContext } from "../../utils/modalUtils";
import { getClientList } from "../../utils/apiUtils";
import Form from "./Form";
import { ButtonPrimary, ButtonSecondary, ActionButtonGroup } from "../root/Buttons";

import { TextField, Alert, useTheme, useMediaQuery } from "@mui/material";
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';

export const AddClient = () => {
    const { dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const navigate = useNavigate();
    const theme = useTheme();
    const xsScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

    const handleSetNewClient = useCallback((client) => {
        setAlerts(prev => [...prev, `${client.firstName} ${client.lastName} 
    was added to your client list. You can now coordinate their care using the calendar.`]);

        const newClient = Object.assign({ carers: [], shifts: [] }, client);
        dispatch({
            type: "setSelectedClient",
            data: newClient
        });

        getClientList().then(clientList => {
            dispatch({
                type: "setClients",
                data: clientList
            });
        });
    }, [dispatch]);

    const handleBackToClients = useCallback(() => {
        modalDispatch({
            type: "close",
            data: "modal"
        });
        navigate("/clients");
    }, [navigate, modalDispatch]);

    // Close the modal when navigating to the calendar
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
                submitButtonText="Add client"
                postURL="/client"
                callback={handleSetNewClient}
                buttonStartIcon={<PersonAddAltRoundedIcon />}
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
                            <Link to="/clients" onClick={handleBackToClients} className="button-link">
                                <ButtonSecondary startIcon={<AssignmentIndRoundedIcon />}>
                                    Client List
                                </ButtonSecondary>
                            </Link>
                            <Link to="/calendar" onClick={handleCloseModal} className="button-link">
                                <ButtonPrimary startIcon={<CalendarMonthRoundedIcon />}>
                                    {xsScreen ? "Calendar" : "View calendar"}
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
