import React from 'react';
import { useMemo, useCallback } from "react";
import { useGlobalContext } from "../utils/globalUtils";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Form from "../components/forms/Form";
import LogoLarge from '../components/logo/LogoLarge';
import { useHandleForm } from "../utils/formUtils";

import { TextField, Typography, Container, useTheme } from "@mui/material";
import { ButtonPrimary } from "../components/root/Buttons";

export default function Login() {
    // Get the global state and set form state
    const { store, dispatch } = useGlobalContext();
    const navigate = useNavigate();

    // Responsive styles
    const theme = useTheme();
    const xsUp = theme.breakpoints.up("xs");

    // Set the initial form state
    const initialState = useMemo(() => {
        return {
            inputs: {
                email: "",
                password: "",
            },
            errors: []
        }
    }, [])
    const [form, setForm] = useHandleForm(initialState);

    const loginUser = useCallback((response) => {
        // console.log(`setting user ${form.inputs.email}...`)
        dispatch({
            type: "login",
            data: response.user
        });
        navigate("/")
    }, [dispatch, navigate]);

    return store.isAuth ? (
        <Outlet />
    ) : (
        <Container maxWidth="md">
            <Typography sx={{
                textAlign: "center", margin: "0 auto", mt: 2,
                [xsUp]: {
                    width: "clamp(25rem, 35vw, 35rem)",
                    maxWidth: "100%",
                },
            }}>
                <LogoLarge alt="CareSync logo" />
            </Typography>
            <Typography variant="h2" textAlign="center"
                sx={{ mb: 3 }}>
                Support work made easy.
            </Typography>
            <Form
                form={form}
                setForm={setForm}
                legend="Sign in"
                buttonText="Log in"
                buttonVariant="outlined"
                postURL="/user/login"
                callback={loginUser}
            >
                {/* <label htmlFor="email">Email address</label> */}
                <TextField
                    label="Email address"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@provider.com"
                    required
                    mui="TextField" />
                {/* <label htmlFor="password">Password</label> */}
                <TextField
                    label="Password"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="**********"
                    required
                    mui="TextField" />
            </Form>
            <Typography variant="h2" style={{ textAlign: "center" }}>Need an account?</Typography>
            <Link to="/register" className="button-link">
                <ButtonPrimary>
                    Sign up
                </ButtonPrimary>
            </Link>
        </Container >
    );
}
