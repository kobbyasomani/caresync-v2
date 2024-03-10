import { useReducer, useCallback, createContext, useContext } from "react";

const ModalContext = createContext();
const useModalContext = () => useContext(ModalContext);

const modalReducer = (state, action) => {
    // console.log("Modal Reducer:", action.type, action.data, action.id);
    switch (action.type) {
        case "open":
            return {
                ...state,
                [`${action.data}IsOpen`]: true,
                id: action.id ? action.id : ""
            }
        case "close":
            return {
                ...state,
                [`${action.data}IsOpen`]: false,
                drawerHistory: action.data === "drawer" ? [] : state.drawerHistory,
                activeDrawer: action.data === "drawer" ? "" : state.activeDrawer,
                activeModal: action.data === "modal" ? {
                    ...state.activeModal,
                    alert: null
                } : state.activeModal
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
                modalIsOpen: false,
                drawerIsOpen: false,
                confirmationIsOpen: false,
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

