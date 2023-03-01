import {
    useCallback,
    cloneElement,
    Children,
} from "react";
import {
    useHandleFormInput,
    useHandleFormErrors
} from "../../utils/formUtils";

import axios from "axios";

import { Box } from "@mui/material";
import { ButtonPrimary } from "../root/Buttons";

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
 * @param {string} postURL The API endpoint to submit the form to.
 * @param {function} callback [optional] A function to be called after form submission
 * that takes the API json response as an argument.
 * @param {*} children The child elements of the form (e.g., labels and inputs) 
 * @returns 
 */
const Form = ({
    form,
    setForm,
    legend,
    buttonText,
    buttonVariant,
    postURL,
    callback,
    children
}) => {
    // console.log(form.inputs);

    // Handle form state and controlled inputs.
    const handleInput = useHandleFormInput(setForm);
    const handleErrors = useHandleFormErrors(setForm);

    /**
     * Validate and submit the form.
     */
    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        let errors = [];

        // Make sure form fields are not empty
        for (const [name, value] of Object.entries(form.inputs)) {
            const inputLabel = document.querySelector(`[name=${name}`).labels[0].textContent
            if (!value) {
                errors.push(`${inputLabel} cannot be blank.\n`);
            }
        }

        // If there are errors, cancel form submission and set them
        if (errors.length > 0) {
            return handleErrors(errors);
            ;
        } else {
            handleErrors([]);
        }

        // If there are no errors submit the form
        axios.post(postURL, form.inputs)
            .then(response => {
                // If a callback is passed, return it and pass it the response data
                if (callback) {
                    // console.log("executing form callback...");
                    callback(response.data);
                }
                // Clear the form after successful submission
                setForm({
                    type: "clearForm"
                });
            })
            .catch(error => {
                // Render validation error messages
                handleErrors([`Error: ${error.response.data.message}`]);
            });
    }, [postURL, form, setForm, handleErrors, callback]);

    return (
        <Box sx={{ my: 2, display: "flex", justifyContent: "center" }}>
            <form>
                <fieldset>
                    {legend ? <legend>{legend}</legend> : null}
                    {/* Pass the input handler and state value to form input elements */}
                    {Children.map(children, (child) => {
                        if (child.props.mui === "TextField" || child.props.mui === "TextArea") {
                            return cloneElement(child, {
                                size: "small",
                                margin: "normal",
                                fullWidth: true,
                                inputProps: {
                                    onChange: handleInput,
                                    value: form.inputs[child.props.name]
                                }
                            });
                        } else {
                            return child;
                        }
                    })}
                    {/* Render form errors if any exist */}
                    {form.errors.length > 0 ? (<div className="form-errors">
                        <ul>
                            {form.errors.map((error, index) => {
                                return <li key={index}>{error}</li>
                            })}
                        </ul>
                    </div>) : null
                    }
                    <ButtonPrimary onClick={handleSubmit} variant={buttonVariant}>
                        {buttonText}
                    </ButtonPrimary>
                </fieldset>
            </form>
        </Box>
    );
}

export default Form;