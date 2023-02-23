import { useCallback, useReducer } from "react";

/**
 * Manages form state using.
 * @param {object} state The form input fields in name-value pairs.
 * @param {string} action The form action to take.
 * @returns 
 */
export default function formReducer(state, action) {
    switch (action.type) {
        case "setForm":
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.name]: action.value
                }
            }
        case "setFormErrors":
            return {
                ...state,
                errors: action.errors
            }
        default:
            return {
                state
            }
    }
}

/**
 * Passes the initial form state to the form state handler (a reducer function)
 * @param {object} initialState The initial state of form inputs in name-value pairs.
 * @returns The form state value and updater function — the result of passing 
 * the form reducer function and the intial state to the `useReducer` hook.
 */
const useHandleForm = (initialState) => useReducer(formReducer, initialState)

/**
 * Handles controlled form input.
 * Sets the value of the target form input in state using the passed dispatch function. 
 * @param {function} dispatch The state update function.
 * @returns {function} An anonymous function that calls dispatch with the passed input event.
 */
const useHandleFormInput = (dispatch) => useCallback((event) => {
    // console.log(event.target.value);
    dispatch({
        type: "setForm",
        name: event.target.name,
        value: event.target.value
    });
}, [dispatch]);

/**
 * Handles form errors.
 * Sets the value of any form errors in state using the passed dispatch function. 
 * @param {function} dispatch The state update function.
 * @param {array} errors An array of form errors.
 * @returns {function} An anonymous function that calls dispatch with the passed errors array.
 */
const useHandleFormErrors = (dispatch) => useCallback((errors) => {
    dispatch({
        type: "setFormErrors",
        errors: errors
    });
}, [dispatch]);

export {
    formReducer,
    useHandleForm,
    useHandleFormInput,
    useHandleFormErrors
}