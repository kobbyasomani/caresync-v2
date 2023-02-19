import { useState } from "react";
import axios from "axios";
import { useGlobalState } from "../utils/globalStateContext";

export default function Home() {
    // Get the global state
    const { store, dispatch } = useGlobalState();

    // Set the form state
    const initialState = {
        email: "",
        password: "",
    }
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState([]);

    /**
     * Handle controlled form input.
     */
    function handleInput(event) {
        setForm(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.value,
            }
        });
    }

    /**
     * Validate and submit the login form.
     */
    function handleLogin(event) {
        event.preventDefault();
        setErrors([]);
        let errors = [];
        // Make sure fields are not empty
        ["email", "password"].forEach(fieldValue => {
            if (!form[fieldValue]) {
                errors.push(`${fieldValue} cannot be blank.\n`);
            }
        });

        // If there are errors, cancel form submission and set them
        if (errors.length > 0) {
            return setErrors(errors);
        } else {
            setErrors([]);
        }

        // If there are no errors submit the form
        axios.post("/user/login", form)
            .then(response => {
                if (response.data.message !== "success") {
                    return setErrors(["Login failed. Check your username and password."]);
                }
                // Set the user if auth succeeds
                dispatch({
                    type: "setUser",
                    data: form.email
                });
                // Clear the form
                setForm(initialState);
            });
    }

    return !store.user ? (
        <>
            <h1>CareSync</h1>
            <h2>Easy care work scheduling and shift notes.</h2>
            <section>
                <form>
                    <fieldset>
                        <legend>Sign in</legend>
                        <label>Email address
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="your@provider.com"
                                required
                                value={form.email}
                                onChange={handleInput} />
                        </label>
                        <label>Password
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="**********"
                                required
                                value={form.password}
                                onChange={handleInput} />
                        </label>
                        <button onClick={handleLogin}>
                            Log in
                        </button>
                    </fieldset>
                </form>
                <div id="form-errors">
                    <ul>
                        {errors.map((error, index) => {
                            return <li key={index}>{error}</li>
                        })}
                    </ul>
                </div>
            </section>
        </>
    ) : (
        <>
            <h1>Hi {store.user},</h1>
            <h2>Let's get started!</h2>
        </>
    )
}