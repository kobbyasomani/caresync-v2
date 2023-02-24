import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const Verification = () => {
    // Initialise verification state as false
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState("");
    const params = useParams();

    // Check submitted verification token with server (query parameter in link)
    useEffect(() => {
        const token = params.token;
        axios.post(`/user/verification/${token}`)
            .then(response => {
                // Set verified state according to server response
                setVerified(response.status === 200 && response.data.isConfirmed);
                // Set verification errors in state
                if (response.status !== 200) {
                    setError(response.data.message);
                }
            });
    }, [params.token]);

    return (
        <>
            <h1>Email Verification</h1>
            {verified ? (
                <>
                    <h2>✅ Your account is verified.</h2>
                    <Link to="/">
                        <button className="button-action">
                            Log in
                        </button>
                    </Link>
                </>
            ) : (
                <>
                    <h2>❌ Verification Error</h2>
                    <p>{error}</p>
                </>

            )}
        </>
    )
}

export default Verification