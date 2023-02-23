import {
    useCallback,
    cloneElement,
    Children
} from "react";
import {
    useHandleForm,
    useHandleFormInput,
    useHandleFormErrors
} from "../utils/formUtils";
import { useGlobalState } from "../utils/globalStateContext";
import axios from "axios";

/**
 * A resuable controlled form component that manages inputs with a reducer function.
 * @param {string} postURL The API endpoint to submit the form to.
 * @returns 
 */
const Form = ({ initialState, legend, submitButtonText, postURL, children }) => {
    const { dispatch } = useGlobalState();

    // Handle form state and controlled inputs. 
    const [form, setForm] = useHandleForm(initialState);
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
            const inputLabel = document.querySelector(`input[name=${name}]`).labels[0].textContent;
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
            .then(() => {
                dispatch({
                    type: "login",
                    data: form.email
                });
            })
            .catch(error => {
                // Render server-side validation error messages
                handleErrors([`Login error: ${error.response.data.message}. 
                Please make sure the email address and password entered are correct.`]);
            })

    }, [postURL, form, dispatch, handleErrors]);

    return (
        <form>
            <fieldset>
                {legend ? <legend>{legend}</legend> : null}
                {Children.map(children, (child) => {
                    if (child.type === "input") {
                        return cloneElement(child, {
                            onChange: handleInput,
                            value: form.inputs[child.props.name]
                        });
                    } else {
                        return child;
                    }
                })}
                {/* Render form errors if any exist */}
                {form.errors.length > 0 ? (<div id="form-errors">
                    <ul>
                        {form.errors.map((error, index) => {
                            return <li key={index}>{error}</li>
                        })}
                    </ul>
                </div>) : null
                }
                <button className="button-action"
                    onClick={handleSubmit}>
                    {submitButtonText}
                </button>
            </fieldset>
        </form>
    );
}

export default Form