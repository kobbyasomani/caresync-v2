import { useReducer, useCallback, createContext, useContext } from "react";

const ModalContext = createContext();
const useModalContext = () => useContext(ModalContext);

const modalReducer = (state, action) => {
    // console.log("MODAL REDUCER:", action.data);
    switch (action.type) {
        case "open":
            return {
                ...state,
                [`${action.data}IsOpen`]: true
            }
        case "close":
            return {
                ...state,
                [`${action.data}IsOpen`]: false,
                prevDrawer: []
            }
        case "setActiveModal":
            return {
                ...state,
                activeModal: action.data
            }
        case "setActiveDrawer":
            // console.log(state.prevDrawer);
            if (action.data === "back") {
                return {
                    ...state,
                    prevDrawer: state.prevDrawer[state.prevDrawer.length - 1] === "" ? [] : state.prevDrawer.slice(0, state.prevDrawer.length - 1),
                    activeDrawer: state.prevDrawer[state.prevDrawer.length - 1],
                }
            }
            return {
                ...state,
                prevDrawer: [...state.prevDrawer, state.activeDrawer],
                activeDrawer: action.data
            }
        case "closeAllModals":
            return {
                ...state,
                modalIsOpen: false,
                drawerIsOpen: false
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

