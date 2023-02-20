export default function globalReducer(state, action) {
    switch (action.type) {
        case "resetStore":
            return {
                user: "",
                patients: null,
                selectedPatient: ""
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