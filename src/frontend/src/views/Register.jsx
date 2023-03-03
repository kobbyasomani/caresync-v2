import React from 'react';
import { useMemo, useCallback, useState } from "react";
import { Link } from "react-router-dom";

import Form from "../components/forms/Form";
import { useHandleForm } from "../utils/formUtils";
import { ButtonSecondary } from "../components/root/Buttons";

import { TextField, Alert, Box, Typography } from "@mui/material";

const Register = () => {
    // Set the initial form state
    const initialState = useMemo(() => {
        return {
            inputs: {
                firstName: "",
                lastName: "",
                email: "",
                password: "",
            },
            errors: []
        }
    }, [])
    const [form, setForm] = useHandleForm(initialState);

    // Alert state
    const [alerts, setAlerts] = useState([]);

    // Register the user and send verification email
    const registerUser = useCallback((user) => {
        setAlerts(prev => [...prev, `User ${user.firstName} ${user.lastName} 
    was registered. Click the link in the verification email sent to ${user.email} 
    to confirm your registration.`]);
    }, []);

    return (
        <>
            <Typography variant="h1">CareSync</Typography>
            <Typography variant="h2">Sign up for an account today.</Typography>
            <Form
                form={form}
                setForm={setForm}
                legend="Register an account"
                buttonText="Register"
                postURL="/user/register"
                callback={registerUser}
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
                <TextField
                    label="Email address"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="your@provider.com"
                    required
                    mui="TextField" />
                <TextField
                    label="Password"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="**********"
                    required
                    mui="TextField" />
            </Form>
            {/* Display alerts */}
            {alerts.length > 0 ? (
                <Box sx={{ textAlign: "center" }}>
                    <h2>Success!</h2>
                    {alerts.map((alert, index) => {
                        return (
                            <Alert severity="success" key={index}>
                                {alert}
                            </Alert>
                        );
                    })}
                    < br />
                    <div className="journey-options">
                        <Link to="/" className="button-link">
                            <ButtonSecondary>
                                Return to Login
                            </ButtonSecondary>
                        </Link>
                    </div>
                </Box>
            ) : (
                <Link to="/" className="button-link">
                    <ButtonSecondary>
                        Return to Login
                    </ButtonSecondary>
                </Link>
            )}
        </>
    )
}

export default Register