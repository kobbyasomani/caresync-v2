import { useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalState } from "../utils/globalStateContext";
import axios from "axios";

export const AddPatient = () => {
    const { dispatch } = useGlobalState();

    // Set the form state
    const initialState = {
        firstName: "",
        lastName: "",
    }
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState([]);
    const [notifications, setNotifications] = useState([]);

    // Handle controlled form input
    function handleInput(event) {
        setForm(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.value,
            }
        });
    }

    // Validate and submit the form
    function addPatient(event) {
        event.preventDefault();
        setErrors([]);
        let errors = [];
        // Make sure fields are not empty
        ["firstName", "lastName"].forEach(fieldValue => {
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
        axios.post("/patient", form)
            .then(response => {
                if (response.status !== 201) {
                    return setErrors(["Patient creation unsuccessful. Please try again."]);
                }
                const patient = response.data;

                // Show success notification
                setNotifications(prev => [...prev, `Patient ${patient.firstName} ${patient.lastName} 
                was added. You can now coordinate their care using the calendar.`]);

                // Set the selectedPatient to newly created patient
                dispatch({
                    type: "setSelectedPatient",
                    data: patient
                });

                // Clear the form
                setForm(initialState);
                // Navigate to patient selection
                // navigate("/select-patient");
            });
    }

    return (
        <>
            <h1>Add a patient</h1>
            <section>
                <form>
                    <fieldset>
                        <legend>Patient details</legend>
                        <label>First name
                            <input
                                id="first-name"
                                type="text"
                                name="firstName"
                                placeholder="Jane"
                                required
                                value={form.firstName}
                                onChange={handleInput} />
                        </label>
                        <label>Last name
                            <input
                                id="last-name"
                                type="text"
                                name="lastName"
                                placeholder="Doe"
                                required
                                value={form.lastName}
                                onChange={handleInput} />
                        </label>
                        <div id="form-errors">
                            <ul>
                                {errors.map((error, index) => {
                                    return <li key={index}>{error}</li>
                                })}
                            </ul>
                        </div>
                    </fieldset>
                    <button className="button-action" onClick={addPatient}>
                        Add patient
                    </button>
                </form>
            </section>
            {notifications.length > 0 ? (
                <>
                    <section>
                        <h2>Success!</h2>
                        {notifications.map((notification, index) => {
                            return <p key={index}>✅ {notification}</p>
                        })}
                        < br />
                        <div className="journey-options">
                            <Link to="/select-patient">
                                ← Return to patients
                            </Link>
                            <Link to="/calendar">
                                View calendar →
                            </Link>
                        </div>
                    </section>
                </>
            ) : null}
        </>
    )
}

export default AddPatient;
