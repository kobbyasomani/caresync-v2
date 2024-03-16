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
    user: {},
    clients: {},
    selectedClient: {},
    shifts: [],
    featuredShift: {},
    previousShifts: [],
    selectedDate: {},
    selectedShift: {},
    inProgressShift: {},
    selectedShiftIsInProgress: false,
    selectedIncidentReport: {},
    refreshCalendar: ""
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
                isAuth: document.cookie.includes("authenticated=true"),
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
        case "setClients":
            return {
                ...state,
                clients: action.data
            }
        case "setSelectedClient":
            return {
                ...state,
                selectedClient: action.data
            }
        case "setSelectedClientById":
            function getClientById(id) {
                if (!id) return {};
                let foundClient = {};
                const allClients = [
                    ...state.clients.coordinator,
                    ...state.clients.carer
                ];
                allClients.forEach(client => {
                    if (client._id === id) {
                        foundClient = client;
                    }
                });
                return foundClient;
            }
            const client = getClientById(action.data);
            return {
                ...state,
                selectedClient: client
            }
        case "setCarers":
            return {
                ...state,
                selectedClient: {
                    ...state.selectedClient,
                    carers: action.data
                }
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
        case "clearSelectedShift":
            return {
                ...state,
                selectedShift: {}
            }
        case "setInProgressShift":
            return {
                ...state,
                inProgressShift: action.data
            }
        case "setSelectedShiftIsInProgress":
            return {
                ...state,
                selectedShiftIsInProgress: action.data
            }
        case "clearShifts":
            return {
                ...state,
                shifts: [],
                featuredShift: {},
                previousShifts: [],
                selectedDate: {},
                selectedShift: {},
                inProgressShift: {},
                selectedShiftIsInProgress: false,
                selectedIncidentReport: {},
            }
        case "setSelectedIncidentReport":
            return {
                ...state,
                selectedIncidentReport: action.data
            }
        case "refreshCalendar":
            return {
                ...state,
                refreshCalendar: new Date().toLocaleString()
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