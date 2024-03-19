import { useReducer, useCallback, createContext, useContext } from "react";

const ModalContext = createContext();
const useModalContext = () => useContext(ModalContext);

const modalReducer = (state, action) => {
    // console.log("Modal Reducer:", action.type, action.data, action.id);
    // TODO: Fix history when the user opens a drawer to a non-home view (pass histoy array?)
    switch (action.type) {
        case "open":
            switch (action.data) {
                case "drawer":
                    // console.log(`Open ${action.data}`);
                    return {
                        ...state,
                        [`${action.data}IsOpen`]: true,
                        id: "drawer",
                        activeDrawer: action.view || ""
                    }
                case "modal":
                case "confirmation":
                    if (action.id) {
                        // console.log(`Open ${action.id}`);
                        return {
                            ...state,
                            [`${action.data}IsOpen`]: true,
                            [`${action.data}Id`]: action.id || ""
                        }
                    } else {
                        return state;
                    }
                default: return state;
            }
        case "close":
            switch (action.data) {
                case "drawer":
                    // console.log(`Close ${action.data}`);
                    return {
                        ...state,
                        [`${action.data}IsOpen`]: false,
                        drawerHistory: [],
                        // activeDrawer: ""
                    }
                case "modal":
                case "confirmation":
                    // console.log(`Close ${state[`${action.data}Id`]}`);
                    return {
                        ...state,
                        [`${action.data}IsOpen`]: false,
                        activeModal: {
                            data: {},
                            alert: null
                        },
                        [`${action.data}Id`]: ""
                    }
                default: return state;
            }
        case "setActiveModal":
            return {
                ...state,
                activeModal: action.data
            }
        case "setActiveDrawer":
            if (action.data === "back") {
                if (state.drawerHistory.length > 0) {
                    return {
                        ...state,
                        activeDrawer: state.drawerHistory[state.drawerHistory.length - 1],
                        drawerHistory: state.drawerHistory.slice(0, -1),
                    }
                } else {
                    return state
                }
            } else {
                const newActiveDrawer = action.data;
                const clearHistory = newActiveDrawer === "";
                return {
                    ...state,
                    drawerHistory: clearHistory ? [] : [...state.drawerHistory, state.activeDrawer],
                    activeDrawer: newActiveDrawer
                }
            }
        case "closeAllModals":
            return {
                ...state,
                drawerIsOpen: false,
                modalIsOpen: false,
                confirmationIsOpen: false,
                modalId: "",
                confirmationId: ""
            }
        default: return state
    }
}

/**
 * Manages the open state of the modal and drawer (shift details) components.
 * @param {object} initialState The initial open state of the modal/drawer.
 * @returns The modal and drawer state and update function.
 */
const useModalReducer = (initialState) => useReducer(modalReducer, initialState);

/**
 * Sets the isOpen state of the modal to true (open) or false (close).
 * @param {function} dispatch The dispatch function returned by useModalReducer
 * @param {string} action The action to perform on the modal ("open" or "close")
 */
const useSetModal = (dispatch, action) => useCallback(() => {
    dispatch({
        type: action,
        data: "modal"
    });
}, [dispatch, action]);

/**
 * Sets the isOpen state of the drawer to true (open) or false (close).
 * @param {function} dispatch The dispatch function returned by useModalReducer
 * @param {string} action The action to perform on the drawer ("open" or "close")
 */
const useSetDrawer = (dispatch, action) => useCallback(() => {
    dispatch({
        type: action,
        data: "drawer"
    });
}, [dispatch, action]);

export {
    ModalContext,
    useModalContext,
    useModalReducer,
    useSetModal,
    useSetDrawer,
}

