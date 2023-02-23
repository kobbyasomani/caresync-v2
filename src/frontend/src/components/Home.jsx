import { useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useGlobalState } from "../utils/globalStateContext";
import { Outlet } from "react-router-dom";

export default function Login() {
    // console.log("rendering Home");

    // Get the global state
    const { store, dispatch } = useGlobalState();

    // Set the initial form state
    const initialState = useMemo(() => {
        return {
            email: "",
            password: "",
        }
    }, [])
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState([]);

    /**
     * Handle controlled form input.
     */
    const handleInput = useCallback((event) => {
        setForm(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.value,
            }
        });
    }, []);

    /**
     * Validate and submit the login form.
     */
    const handleLogin = useCallback((event) => {
        console.log("logging in...");

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

        // If there are no errors submit the form and navigate to /select-patient
        axios.post("/user/login", form)
            .then(() => {
                dispatch({
                    type: "login",
                    data: form.email
                });
            })
            .catch(error => {
                setErrors([`Login error: ${error.response.data.message}`]);
            })

    }, [dispatch, form]);

    return store.isAuth ? (
        <Outlet />
    ) : (
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
                        {errors.length > 0 ? (<div id="form-errors">
                            <ul>
                                {errors.map((error, index) => {
                                    return <li key={index}>{error}</li>
                                })}
                            </ul>
                        </div>) : null
                        }
                        <button className="button-action" onClick={handleLogin}>
                            Log in
                        </button>
                    </fieldset>
                </form>
            </section>
            <section>
                <h2 style={{ textAlign: "center" }}>No account?</h2>
                <button className="button-action">
                    Sign up
                </button>
            </section>
        </>
    )
}