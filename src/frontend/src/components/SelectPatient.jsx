import { useEffect, useState } from "react";
import { useGlobalState } from "../utils/globalStateContext";
import { useNavigate, Link } from "react-router-dom";
import baseURL from "../utils/baseUrl";

const Patient = ({ patient }) => {
    const { dispatch } = useGlobalState();
    const { _id, firstName, lastName, nextShift } = patient;
    const navigate = useNavigate();

    let caringFor;
    let nextShiftDate = () => {
        if (nextShift) {
            if (typeof nextShift === "string") {
                return new Date(nextShift).toLocaleString();
            }
            caringFor = true;
            return new Date(nextShift[0].time).toLocaleString();
        }
        return "No upcoming shift";
    }

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
            <div className="shift">
                Next shift: {nextShiftDate()}
                {caringFor ? <div className="caring-for">You are the carer for this shift.</div> : null}</div>
        </div>
    );
}

const SelectPatient = () => {
    // console.log("rendering SelectPatient");

    const { store, dispatch } = useGlobalState();
    const [isLoading, setIsLoading] = useState(true);
    const [patients, setPatients] = useState([]);

    // Fetch the list of patients for the logged-in user
    useEffect(() => {
        fetch(`${baseURL}/user`, {
            credentials: "include"
        }).then(response => response.json())
            .then(patients => {
                dispatch({
                    type: "setPatients",
                    data: patients
                });
                setPatients(patients);
                setIsLoading(false);
            }).catch(error => console.error(error.message));
    }, [dispatch]);

    return isLoading ? (
        <>
            <h1>Hi, {store.user}</h1>
            <h2>Fetching patients...</h2>
        </>
    ) : (
        <>
            <h1>Hi, {store.user}</h1>
            <h2>Select a patient</h2>
            {patients && patients.carer.length > 0 ? (
                <section>
                    <h3>Caring for</h3>
                    {patients.carer.map(patient => (
                        <Patient patient={patient} key={patient._id} />
                    ))}
                </section>
            ) : null}
            {patients && patients.coordinator.length > 0 ? (
                <section>
                    <h3>Coordinating for</h3>
                    {patients.coordinator.map(patient => (
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
    )
}

export default SelectPatient