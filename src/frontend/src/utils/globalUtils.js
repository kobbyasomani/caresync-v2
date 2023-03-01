import { createContext, useContext } from "react";

const GlobalStateContext = createContext();
/**
 * Context forproviding global state to child components.
 * @returns The current global state context value object.
 */
const useGlobalContext = () => useContext(GlobalStateContext);

// Global store in empty state
const emptyStore = {
    isAuth: false,
    user: "",
    selectedPatient: {},
    shifts: [],
    featuredShift: {},
    previousShifts: [],
    selectedShift: {},
}

/**
 * Reducer function for managing the global state.
 * @param {object} action An object containing the type of action to take 
 * and the data to update global state.
 * @returns 
 */
const globalReducer = (state, action) => {
    // console.log(`GLOBAL STATE CHANGED: ${action.type}`);
    switch (action.type) {
        case "login":
            return {
                ...state,
                isAuth: true,
                user: action.data
            }
        case "logout":
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
        case "setSelectedDate":
            return {
                ...state,
                selectedDate: action.data
            }
        case "setShift":
            return {
                ...state,
                shifts: [
                    ...state.shifts,
                    action.data
                ]
            }
        case "setShifts":
            return {
                ...state,
                shifts: action.data
            }
        case "setFeaturedShift":
            return {
                ...state,
                featuredShift: action.data
            }
        case "setPreviousShifts":
            return {
                ...state,
                previousShifts: action.data
            }
        case "setSelectedShift":
            return {
                ...state,
                selectedShift: action.data
            }
        case "clearShifts":
            return {
                ...state,
                shifts: [],
                featuredShift: {},
                previousShifts: [],
                selectedShift: {},
            }
        default: return state;
    }
}

export {
    GlobalStateContext,
    useGlobalContext,
    globalReducer,
    emptyStore,
}