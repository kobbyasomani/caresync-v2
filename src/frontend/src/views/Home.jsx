import React, { useMemo, useCallback } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

import { useGlobalContext } from "../utils/globalUtils";
import { useHandleForm } from "../utils/formUtils";
import { baseURL_API } from "../utils/baseURL";
import Form from "../components/forms/Form";
import LogoLarge from '../components/logo/LogoLarge';
import Loader from "../components/logo/Loader";

import { TextField, Typography, Container, useTheme, Box } from "@mui/material";
import { ButtonPrimary } from "../components/root/Buttons";

export default function Login() {
    // Get the global state and set form state
    const { store, dispatch, crypto, isLoading } = useGlobalContext();
    const { loadSession, saveSession } = crypto;
    const navigate = useNavigate();
    const isDemo = process.env.REACT_APP_DEMO;

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

    const handleLoginUser = useCallback((response) => {
        dispatch({
            type: "login",
            data: response.user
        });
        loadSession().then(sessionLoaded => {
            if (!sessionLoaded) {
                return saveSession();
            }
        }).then(() => {
            navigate("/");
        });
    }, [dispatch, navigate, loadSession, saveSession]);

    const handleStartDemo = useCallback(() => {
        fetch(`${baseURL_API}/user/register-demo`, {
            credentials: "include"
        })
            .then((response) => response.json())
            .then((json) => {
                dispatch({
                    type: "login",
                    data: json.user
                })
            }).then(() => {
                navigate("/");
            });
    }, [dispatch, navigate]);

    return isLoading ? <Loader />
        : store.isAuth ? (
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
                    submitButtonText="Log in"
                    buttonVariant="outlined"
                    postURL="/user/login"
                    callback={handleLoginUser}
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
                {isDemo ?
                    <Box maxWidth="sm" sx={{ mx: "auto" }}>
                        <Typography variant="h2" style={{ textAlign: "center" }}>
                            Create a demo account
                        </Typography>
                        <Typography variant="body1" sx={{ maxWidth: "50ch", mx: "auto", textAlign: "center" }}>
                            Demo accounts use auto-generated credentials and are
                            deleted after 30 days. Take note of your login details after
                            starting the demo if you want to revisit the account again!
                        </Typography>
                    </Box>
                    : <Typography variant="h2" style={{ textAlign: "center" }}>
                        Need an account?
                    </Typography>}

                {isDemo ? (
                    <ButtonPrimary onClick={handleStartDemo}>
                        Start app demo
                    </ButtonPrimary>
                ) : (
                    <Link to="/register" className="button-link">
                        <ButtonPrimary>
                            Sign up
                        </ButtonPrimary>
                    </Link>
                )}
            </Container >
        );
}
