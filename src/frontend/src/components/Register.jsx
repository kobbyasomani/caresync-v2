import Form from "./Form";
import { useHandleForm } from "../utils/formUtils";
import { useMemo, useCallback, useState } from "react";
import { Link } from "react-router-dom";

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

    // Notification state
    const [notifications, setNotifications] = useState([]);

    // Register the user and send verification email
    const registerUser = useCallback((user) => {
        setNotifications(prev => [...prev, `User ${user.firstName} ${user.lastName} 
    was registered. Click the link in the verification email sent to ${user.email} 
    to confirm your registration.`]);
    }, []);

    return (
        <>
            <h1>CareSync</h1>
            <h2>Sign up for an account today.</h2>
            <div>
                <Form
                    form={form}
                    setForm={setForm}
                    legend="Register an account"
                    submitButtonText="Register"
                    postURL="/user/register"
                    callback={registerUser}
                >
                    <label htmlFor="first-name">First name</label>
                    <input
                        id="first-name"
                        type="text"
                        name="firstName"
                        placeholder="Jane"
                        required />
                    <label htmlFor="last-name">Last name</label>
                    <input
                        id="last-name"
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        required />
                    <label htmlFor="email">Email address</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="your@provider.com"
                        required />
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="**********"
                        required />
                </Form>
            </div>
            {/* Display notifications */}
            {notifications.length > 0 ? (
                <div>
                    <h2>Success!</h2>
                    {notifications.map((notification, index) => {
                        return <p key={index}>✅ {notification}</p>
                    })}
                    < br />
                    <div className="journey-options">
                        <Link to="/">
                            ← Return to Login
                        </Link>
                    </div>
                </div>
            ) : null}
        </>
    )
}

export default Register