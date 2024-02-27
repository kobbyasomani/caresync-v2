import React, { forwardRef, useCallback, cloneElement, Children, useState, } from "react";
import {
    useHandleFormInput,
    useHandleFormErrors
} from "../../utils/formUtils";
import axios from "axios";

import { ButtonPrimary } from "../root/Buttons";
import Loader from "../logo/Loader";

import { Box, Stack } from "@mui/material";

/**
 * A resuable controlled form component that manages inputs with a reducer function.
 * @param {object} form The local form state object.
 * @param {function} setForm The form reducer update function.
 *  Pass as an object with two props: `inputs` and `errors`. 
 * `inputs: {}` is an object containing input name-value pairs. 
 * `errors: []` is an array of error message strings.
 * @param {string} legend [optional] A legend to display at the top of the form fieldset.
 * @param {string} buttonText Text for the form submit button.
 * @param {string} buttonVariant set the mui button variant.
 * One of 'text', 'contained', or 'outlined' (defaults to contained).
 * @param {boolean} hideSubmitButton If true, the submit button will be hidden. This
 * is useful in instances where a higher-level component is managing the form submission.
 * @param {string} postURL The API endpoint to submit the form to.
 * @param {string} method The HTTP request method to use.
 * @param {function} validation Additional validation to perform before submitting form.
 * The provided function should throw errors based on conditional statements, which the
 * form will catch and display to the user. The validator function recieves the form state as an arg.
 * @param {function} callback [optional] A function to be called after form submission
 * that takes the API json response as an argument.
 * @param {*} children The child elements of the form (e.g., labels and inputs)
 * @param {function} setParentIsLoading A function to update the load state of the parent.
 * @returns
 */
const Form = forwardRef((
    { form,
        setForm,
        legend,
        buttonText,
        buttonVariant,
        postURL,
        method,
        validation,
        callback,
        hideSubmitButton,
        children,
        setParentIsLoading,
    }, formRef) => {
    // console.log(form.inputs);

    // Handle form state and controlled inputs.
    const handleInput = useHandleFormInput(setForm);
    const handleErrors = useHandleFormErrors(setForm);
    const [formFeedback, setFormFeedback] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const updateLoadState = useCallback((isLoading) => {
        setIsLoading(isLoading);
        if (setParentIsLoading) {
            setParentIsLoading(isLoading);
        }
    }, [setIsLoading, setParentIsLoading]);

    /**
     * Submit form to the postURL using axios
     */
    const submitForm = useCallback(() => {
        updateLoadState(true)
        axios({
            url: postURL,
            method: method || "post",
            data: form.inputs
        }).then(response => {
            // If a callback is passed, return it and pass it the response data
            if (callback) {
                // console.log("executing form callback...");
                callback(response.data);
            }
            // Clear the form after successful submission
            setForm({
                type: "clearForm"
            });
        }).then(() => {
            updateLoadState(false);
        }).catch(error => {
            // Render validation error messages
            handleErrors([`Error: ${error.response.data?.message || error.message}`]);
        });
    }, [callback, form.inputs, handleErrors, method, postURL, setForm, updateLoadState]);

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
            // Render validation error messages
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
            // console.log(`checking ${name} field...`);
            if (document.querySelector([`[name=${name}]`]).required) {
                const inputLabel = document.querySelector(`[name=${name}]`).labels[0].textContent
                if (!value) {
                    errors.push(`${inputLabel} cannot be blank.\n`);
                }
            }
        }

        // Perform additional validation if any has been provided.
        try {
            if (validation) {
                // console.log("Performing additional validation...");
                validation(form);
            }
        } catch (error) {
            errors.push(error.message);
        }

        // If there are errors, cancel form submission and set them
        if (errors.length > 0) {
            return handleErrors(errors);
            ;
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
                        if (child.props.mui === "TextField" || child.props.mui === "TextArea") {
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
                        } else if (child.props.mui === "Select") {
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
                    <Stack direction="row" gap={0}>
                        {!hideSubmitButton ? (
                            <ButtonPrimary onClick={handleSubmit} variant={buttonVariant}>
                                {buttonText}
                            </ButtonPrimary>
                        ) : <button ref={formRef} onClick={handleSubmit}
                            style={{ opacity: 0 }}></button>
                        }
                        {form.errors?.includes("Error: Please confirm your email") ? (
                            <ButtonPrimary onClick={sendVerificationEmail}>
                                Resend verification email
                            </ButtonPrimary>
                        ) : (null)}
                    </Stack>
                </fieldset>
            </form>
        </Box >
    );
});

export default Form;