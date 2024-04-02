import React, { forwardRef, useCallback, cloneElement, Children, useState, } from "react";
import axios from "axios";

import { useHandleFormInput, useHandleFormErrors } from "../../utils/formUtils";
import { useGlobalContext } from "../../utils/globalUtils";
import { ButtonPrimary } from "../root/Buttons";
import Loader from "../logo/Loader";

import { Box, Stack } from "@mui/material";

/**
 * A resuable controlled form component that manages inputs with a reducer function.
 * 
 * If the component receives a `ref`, this `ref` will be passed to the sumbmit button so that it can be
 * triggered by a higher level component using the `ref.current.click()` method.
 * @param {Object} form The local form state object.
 * @param {Object} initialState The inital state of the form.
 * @param {Function} setForm The form reducer update function.
 *  Pass as an object with two props: `inputs` and `errors`. 
 * `inputs: {}` is an object containing input name-value pairs. 
 * `errors: []` is an array of error message strings.
 * @param {String} legend [optional] A legend to display at the top of the form fieldset.
 * @param {String} submitButtonText Text for the form submit button.
 * @param {Object} buttonSecondary An optional secondary button to render in the form.
 * @param {String} buttonVariant set the mui button variant.
 * One of 'text', 'contained', or 'outlined' (defaults to contained).
 * @param {Boolean} hideSubmitButton If true, the submit button will be hidden. This
 * is useful in instances where a higher-level component is managing the form submission.
 * @param {String} postURL The API endpoint to submit the form to.
 * @param {String} method The HTTP request method to use.
 * @param {Function} validation Additional validation to perform before submitting form.
 * The provided function should throw errors based on conditional statements, which the
 * form will catch and display to the user. The validator function recieves the form state as an arg.
 * @param {Function} callback [optional] A function to be called after form submission
 * that takes the API json response as an argument.
 * @param {*} children The child elements of the form (e.g., labels and inputs)
 * @param {Function} setParentIsLoading A function to update the load state of the parent.
 * @param {Boolean} dontClear If true, will not clear the form on submission.
 * @returns {Object} The JSON data returned by the API call if successfull.
 */
const Form = forwardRef((
    { form,
        initialState,
        setForm,
        legend,
        submitButtonText,
        buttonSecondary,
        buttonVariant,
        postURL,
        method,
        validation,
        callback,
        hideSubmitButton,
        children,
        setParentIsLoading,
        dontClear
    }, formRef) => {
    const { dispatch } = useGlobalContext();

    // Handle form state and controlled inputs.
    const handleInput = useHandleFormInput(setForm);
    const handleErrors = useHandleFormErrors(setForm);
    const [formFeedback, setFormFeedback] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const updateLoadState = useCallback((isLoading, errors) => {
        setIsLoading(isLoading);
        if (setParentIsLoading) {
            setParentIsLoading(isLoading, errors);
        }
    }, [setIsLoading, setParentIsLoading]);

    /**
     * Submit form to the postURL using axios
     */
    const submitForm = useCallback(() => {
        updateLoadState(true);
        axios({
            url: postURL,
            method: method || "post",
            data: form.inputs
        }).then(response => {
            if (!dontClear) {
                setForm({
                    type: initialState ? "initForm" : "clearForm",
                    data: initialState || null
                });
            }
            if (callback) {
                callback(response.data);
            }
            dispatch({
                type: "refreshCalendar"
            });
            updateLoadState(false);
        }).catch(error => {
            // Render validation error messages
            console.log(error);
            handleErrors([`Error: ${error.response?.data?.message || error.message}`]);
            updateLoadState(false, [`Error: ${error.response?.data?.message || error.message}`]);
        });
    }, [callback, form.inputs, handleErrors, method, postURL, setForm, updateLoadState, initialState, dontClear, dispatch]);

    /**
     * Resend user verification email
     */
    const sendVerificationEmail = useCallback(() => {
        axios({
            url: "/user/resend-verification",
            method: "POST",
            data: { email: form.inputs.email }
        }).then(response => {
            setFormFeedback(response.data.message);
        }).catch(error => {
            handleErrors([`Error: ${error.response.data.message}`]);;
        });
    }, [form.inputs.email, handleErrors]);


    /**
     * Validate and submit the form.
     */
    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        let errors = [];
        // Make sure required form fields are not empty
        for (const [name, value] of Object.entries(form.inputs)) {
            if (document.querySelector([`[name=${name}]`])?.required) {
                const inputLabel = document.querySelector(`[name=${name}]`).labels[0].textContent
                if (!value) {
                    errors.push(`${inputLabel} cannot be blank.\n`);
                }
            }
        }
        // Perform additional validation if any has been provided.
        try {
            if (validation) {
                validation(form);
            }
        } catch (error) {
            errors.push(error.message);
        }
        // If there are errors, cancel form submission and set them
        if (errors.length > 0) {
            return handleErrors(errors);
        } else {
            handleErrors([]);
        }
        // If there are no errors submit the form
        submitForm();
    }, [form, handleErrors, validation, submitForm]);

    return isLoading ? <Loader /> : (
        <Box sx={{ my: 2, display: "flex", justifyContent: "center" }}>
            <form>
                <fieldset>
                    {legend ? <legend>{legend}</legend> : null}
                    {/* Pass the input handler and state value to form input elements */}
                    {Children.map(children, (child) => {
                        if (child?.props.mui === "TextField" || child?.props.mui === "TextArea") {
                            // console.log(child);
                            return cloneElement(child, {
                                size: "small",
                                margin: "normal",
                                fullWidth: true,
                                inputProps: {
                                    onChange: handleInput,
                                    value: form.inputs[child.props.name]
                                }
                            });
                        } else if (child?.props.mui === "Select") {
                            // console.log(child);
                            // return cloneElement(child, {
                            //     fullWidth: true,
                            //     inputProps: {
                            //         onChange: handleInput,
                            //         value: form.inputs[child.props.name]
                            //     },
                            // });
                        } else {
                            return child;
                        }
                    })}
                    {/* Render form errors if any exist */}
                    {form.errors?.length > 0 ? (
                        <div className="form-errors">
                            <ul>
                                {form.errors.map((error, index) => {
                                    return <li key={index}>{error}</li>
                                })}
                            </ul>
                        </div>) : null
                    }
                    {formFeedback ? (
                        <div className="form-feedback">
                            {formFeedback}
                        </div>) : null
                    }
                    {!hideSubmitButton ? (
                        <Stack direction="row">
                            <ButtonPrimary onClick={handleSubmit} variant={buttonVariant}>
                                {submitButtonText}
                            </ButtonPrimary>
                            {buttonSecondary}
                        </Stack>
                    ) : <button ref={formRef} onClick={handleSubmit}
                        style={{ opacity: 0 }}></button>
                    }
                    {form.errors?.includes("Error: Please confirm your email") ? (
                        <ButtonPrimary onClick={sendVerificationEmail}>
                            Resend verification email
                        </ButtonPrimary>
                    ) : (null)}
                </fieldset>
            </form>
        </Box >
    );
});

export default Form;