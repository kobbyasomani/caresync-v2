export default function globalReducer(state, action) {
    // console.log(`GLOBAL STATE CHANGED: ${action.type}`);
    switch (action.type) {
        case "login":
            return {
                ...state,
                isAuth: true,
                user: action.data
            }
        case "logout":
            const emptyStore = {
                isAuth: false,
                user: "",
                selectedPatient: ""
            }
            window.localStorage.setItem("careSync", JSON.stringify(emptyStore));
            return emptyStore;
        case "setIsAuth":
            return {
                ...state,
                isAuth: action.data
            }
        case "setUser":
            return {
                ...state,
                user: action.data
            }
        case "setPatients":
            return {
                ...state,
                patients: action.data
            }
        case "setSelectedPatient":
            return {
                ...state,
                selectedPatient: action.data
            }
        case "setSelectedPatientById":
            function getPatientById(id) {
                if (!id) return "";
                let foundPatient;
                const allPatients = [
                    ...state.patients.coordinator,
                    ...state.patients.carer
                ];
                allPatients.forEach(patient => {
                    if (patient._id === id) {
                        foundPatient = patient;
                    }
                });
                return foundPatient;
            }
            const patient = getPatientById(action.data)
            return {
                ...state,
                selectedPatient: patient
            }
        default: return state;
    }
}