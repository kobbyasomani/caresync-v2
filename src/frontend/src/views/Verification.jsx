import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import { ButtonPrimary } from "../components/root/Buttons";

import { Alert } from "@mui/material";

const Verification = () => {
    // Initialise verification state as false
    const [verified, setVerified] = useState(false);
    const params = useParams();

    // Check submitted verification token with server (query parameter in link)
    useEffect(() => {
        const token = params.token;
        axios.post(`/user/verification/${token}`)
            .then(response => {
                // Set verified state according to server response
                setVerified(response.status === 200 && response.data.message === "Email successfully confirmed.");
            });
    }, [params.token]);

    return (
        <>
            <h1>Email Verification</h1>
            {verified ? (
                <>
                    <Alert severity="success" sx={{ alignItems: "center" }}>
                        <h2>Success! Your account is now verified.</h2>
                    </Alert>
                    <Link to="/" className="button-link">
                        <ButtonPrimary>
                            Log in
                        </ButtonPrimary>
                    </Link>
                </>
            ) : (
                <>
                    <Alert severity="error" sx={{ alignItems: "center" }}>
                        <h2>Your account could not be verified.</h2>
                    </Alert>
                    <p>Please make sure you have not modified the URL in the
                        verification email &#40;for example if you copied and
                        then pasted it&#41;. Try clicking the verification link again.
                    </p>
                    <p>If you are still unable to complete your verification, <Link>contact us for help</Link>.</p>
                    <Link to="/" className="button-link">
                        <ButtonPrimary>
                            Return Home
                        </ButtonPrimary>
                    </Link>
                </>
            )}
        </>
    )
}

export default Verification