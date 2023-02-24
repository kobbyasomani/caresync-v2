import { useEffect } from "react";
import { useGlobalState } from "../utils/globalStateContext";
import { useNavigate, Link, Navigate } from "react-router-dom";
import baseURL from "../utils/baseUrl";

const Patient = ({ patient }) => {
    const { dispatch } = useGlobalState();
    const { _id, firstName, lastName } = patient;
    const navigate = useNavigate();

    const selectPatient = (event) => {
        dispatch({
            type: "setSelectedPatientById",
            data: event.currentTarget.id
        });
        // Redirect to calendar after selecting a patient
        navigate("/calendar");
    }

    return (
        <div id={_id} className="patient" onClick={selectPatient}>
            <div className="icon">👤</div>
            <div className="name">{firstName} {lastName}</div>
            <div className="shift">Upcoming shift: dd/mm/yyyy</div>
        </div>
    );
}

const SelectPatient = () => {
    // console.log("rendering SelectPatient");

    const { store, dispatch } = useGlobalState();

    // Fetch the list of patients for the logged-in user
    useEffect(() => {
        if (store.isAuth) {
            fetch(`${baseURL}/user`, {
                credentials: "include"
            }).then(response => response.json())
                .then(patients => {
                    dispatch({
                        type: "setPatients",
                        data: patients
                    });
                }).catch(error => console.error(error.message));
        }
    }, [dispatch, store.isAuth]);

    return store.isAuth ? (
        <>
            <h1>Hi, {store.user}</h1>
            <h2>Select a patient</h2>
            {store.patients && store.patients.carer.length > 0 ? (
                <section>
                    <h3>Caring for</h3>
                    {store.patients.carer.map(patient => (
                        <Patient patient={patient} key={patient._id} />
                    ))}
                </section>
            ) : null}
            {store.patients && store.patients.coordinator.length > 0 ? (
                <section>
                    <h3>Coordinating for</h3>
                    {store.patients.coordinator.map(patient => (
                        <Patient patient={patient} key={patient._id} />
                    ))}
                </section>
            ) : (
                <p>Add a patient to get started.</p>
            )}

            <Link to={"/add-patient"}>
                <button className="button-action">
                    Add patient
                </button>
            </Link>
        </>
    ) : (
        <Navigate to="/" />
    )
}

export default SelectPatient