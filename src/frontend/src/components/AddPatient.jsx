import { useState, useCallback, navigate } from "react";
import { Link } from "react-router-dom";
import { useGlobalState } from "../utils/globalStateContext";
import { useHandleForm } from "../utils/formUtils";
import Form from "./Form";

export const AddPatient = () => {
    // console.log("rendering AddPatient");

    const { dispatch } = useGlobalState();

    // Set the form state
    const initialState = {
        inputs: {
            firstName: "",
            lastName: "",
        },
        errors: []
    }
    const [form, setForm] = useHandleForm(initialState);

    // Notification state
    const [notifications, setNotifications] = useState([]);

    const setNewPatient = useCallback((patient) => {
        // console.log("setting new patient...");
        // Show success notification
        setNotifications(prev => [...prev, `Patient ${patient.firstName} ${patient.lastName} 
    was added. You can now coordinate their care using the calendar.`]);

        // Set the selectedPatient to newly created patient
        dispatch({
            type: "setSelectedPatient",
            data: patient
        });
    }, [dispatch]);

    const switchPatient = useCallback(() => {
        dispatch({
            type: "setSelectedPatient",
            data: ""
        });
        navigate("/");
    }, [dispatch]);

    return (
        <>
            <h1>Add a patient</h1>
            <div>
                <Form
                    form={form}
                    setForm={setForm}
                    legend="Add a new patient"
                    submitButtonText="Add patient"
                    postURL="/patient"
                    callback={setNewPatient}
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
                        <Link to="/" onClick={switchPatient}>
                            ← Return to patients
                        </Link>
                        <Link to="/calendar">
                            View calendar →
                        </Link>
                    </div>
                </div>
            ) : null}
        </>
    )
}

export default AddPatient;
