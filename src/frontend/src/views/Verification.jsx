import React from "react";
import { useState, useEffect } from "react";
import { useParams, useLocation, Link, Navigate } from "react-router-dom";
import axios from "axios";

import { ButtonPrimary } from "../components/root/Buttons";
import Loader from "../components/logo/Loader";

import { Alert, Typography, Stack, Container } from "@mui/material";

const Verification = () => {
    // Initialise verification state as false
    const [isVerified, setIsVerified] = useState(false);
    const [previouslyVerified, setPreviouslyVerified] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const params = useParams();

    // Check submitted verification token with server (url param)
    useEffect(() => {
        //Handle user account verification
        if (location.pathname.includes("/emailVerification/")) {
            const token = params.token;
            axios.post(`/user/verification/${token}`)
                .then(response => {
                    // Set verified state according to server response
                    setIsVerified(response.status === 200
                        && response.data.message === "Email successfully confirmed.");
                    setIsLoading(false);
                });
            // Handle carer invite verification
        } else if (location.pathname.includes("/addCarer/")) {
            const token = params.token;
            axios.post(`/carer/add/${token}`)
                .then(response => {
                    setIsVerified(response.status === 200);
                    setIsLoading(false);
                })
                .catch(function (error) {
                    console.log("Carer invitation error:", error);
                    if (error.response && error.response.status === 400
                        && error.response.data.message === "The carer has already been assigned to this client.") {
                        setPreviouslyVerified(true);
                    } else {
                        // Handle all other errors (network, server, etc.)
                        setIsVerified(false);
                    }
                    setIsLoading(false);
                });
        }
    }, [params.token, location]);

    return isLoading ? <Loader /> : (
        previouslyVerified ? (
            location.pathname.includes("/addCarer/") ? (
                <Container maxWidth="md" mt={4}>
                    <Stack spacing={2}>
                        <Typography variant="h1">Care Team Verification</Typography>
                        <Alert severity="success" sx={{ alignItems: "center" }}>
                            <Typography variant="h2">You have already accepted this invitation.</Typography>
                        </Alert>
                        <Link to="/" className="button-link">
                            <ButtonPrimary>
                                Log in
                            </ButtonPrimary>
                        </Link>
                    </Stack>
                </Container>
            ) : <Navigate to="/" />
        ) : isVerified ? (
            location.pathname.includes("/emailVerification/") ? (
                <Container maxWidth="md" mt={4}>
                    <Stack spacing={2}>
                        <Typography variant="h1">Email Verification</Typography>
                        <Alert severity="success" sx={{ alignItems: "center" }}>
                            <Typography variant="h2">Success! Your account is now verified.</Typography>
                        </Alert>
                        <Link to="/" className="button-link">
                            <ButtonPrimary>
                                Log in
                            </ButtonPrimary>
                        </Link>
                    </Stack>
                </Container>
            ) : location.pathname.includes("/addCarer/") ? (
                <Container maxWidth="md" mt={4}>
                    <Stack spacing={2}>
                        <Typography variant="h1">Care Team Verification</Typography>
                        <Alert severity="success" sx={{ alignItems: "center" }}>
                            <Typography variant="h2">Success! You were added to the care team.</Typography>
                        </Alert>
                        <Link to="/" className="button-link">
                            <ButtonPrimary>
                                Log in
                            </ButtonPrimary>
                        </Link>
                    </Stack>
                </Container>
            ) : null
        ) : (
            location.pathname.includes("/emailVerification/") ? (
                <Container maxWidth="md" mt={4}>
                    <Stack spacing={2}>
                        <Typography variant="h1">Email Verification</Typography>
                        <Alert severity="error" sx={{ alignItems: "center" }}>
                            <Typography variant="h2">Your account could not be verified.</Typography>
                        </Alert>
                        <Typography variant="body1">Please make sure you have not modified the URL in the
                            verification email &#40;for example if you copied and
                            then pasted it&#41;. Try clicking the verification link again.
                        </Typography>
                        <Typography variant="body1">If you are still unable to complete your verification, <Link>
                            contact us for help</Link>.</Typography>
                        <Link to="/" className="button-link">
                            <ButtonPrimary>
                                Return Home
                            </ButtonPrimary>
                        </Link>
                    </Stack>
                </Container>
            ) : location.pathname.includes("/addCarer/") ? (
                <Container maxWidth="md" mt={4}>
                    <Stack spacing={2}>
                        <Typography variant="h1">Care Team Verification</Typography>
                        <Alert severity="error" sx={{ alignItems: "center" }}>
                            <Typography variant="h2">You could not be added to the care team.</Typography>
                        </Alert>
                        <Typography variant="body1">Please make sure you have not modified the URL in the
                            invitation email &#40;for example if you copied and
                            then pasted it&#41;. Try clicking the invitation link again.
                        </Typography>
                        <Typography variant="body1">If you are still unable to complete your verification, <Link>
                            contact us for help</Link>.</Typography>
                        <Link to="/" className="button-link">
                            <ButtonPrimary>
                                Return Home
                            </ButtonPrimary>
                        </Link>
                    </Stack>
                </Container>
            ) : <Navigate to="/" />
        )
    )

}

export default Verification