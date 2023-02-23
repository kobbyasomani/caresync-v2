import { useNavigate, Link } from "react-router-dom";
import { useGlobalState } from "../utils/globalStateContext";

export const Calendar = () => {
    // console.log("rendering Calendar");

    const { store, dispatch } = useGlobalState();
    const navigate = useNavigate();
    const patient = store.selectedPatient;

    function switchPatient() {
        dispatch({
            type: "setSelectedPatient",
            data: ""
        });
        navigate("/");
    }

    return (
        patient ? (
            <>
                <div className="patient small"
                    onClick={switchPatient}>👤 {patient.firstName} {patient.lastName}
                </div>
                <p>Calendar goes here</p>
            </>
        ) : (
            <>
                <h1>It looks like there's no patient selected...</h1>
                <Link
                    to="/select-patient">
                    Select Patient
                </Link>
            </>

        )
    );
}

export default Calendar;
