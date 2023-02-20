import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../utils/globalStateContext";

export const Calendar = () => {
    const { store, dispatch } = useGlobalState();
    const navigate = useNavigate();
    const patient = store.selectedPatient;

    function switchPatient() {
        dispatch({
            type: "setSelectedPatient",
            data: ""
        });
        navigate("/select-patient");
    }

    return (
        <>
            <div className="patient small"
                onClick={switchPatient}>👤 {patient.firstName} {patient.lastName}
            </div>
            <p>Calendar goes here</p>
        </>
    );
}

export default Calendar;
