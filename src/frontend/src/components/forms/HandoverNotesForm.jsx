import { useState, useCallback, forwardRef } from "react";

import { useGlobalContext } from "../../utils/globalUtils";
import baseURL from "../../utils/baseUrl";
import { useHandleForm } from "../../utils/formUtils";
import Form from "./Form";
import Loader from "../logo/Loader";

import { TextField } from "@mui/material";


const HandoverNotesForm = forwardRef(({ editMode, setEditMode, hideSubmitButton, setParentIsLoading }, formRef) => {
    const { store, dispatch } = useGlobalContext();

    const initialState = {
        inputs: {
            handoverNotes: editMode ? store.selectedShift.handoverNotes : ""
        },
        errors: []
    }
    const [form, setForm] = useHandleForm(initialState);
    const [isLoading, setIsLoading] = useState(false);

    const handleChildLoadState = useCallback((childIsLoading) => {
        setIsLoading(childIsLoading);
        if (setParentIsLoading) {
            setParentIsLoading(childIsLoading);
        }
    }, [setParentIsLoading]);

    const checkForChanges = useCallback((form) => {
        if (store.selectedShift.handoverNotes === form.inputs.handoverNotes) {
            throw new Error("No changes have been made. Select \"Cancel\" to leave edit mode.");
        } else {
            // Continue
        }
    }, [store.selectedShift.handoverNotes]);

    const updateHandoverNotes = useCallback((response) => {
        dispatch({
            type: "setSelectedShift",
            data: {
                ...response,
            }
        });
        setEditMode(false);
    }, [dispatch, setEditMode, ])

    return isLoading ? <Loader /> : (
        <Form form={form}
            setForm={setForm}
            legend={editMode ? "Edit your handover notes" : "Add handover notes for this client's next shift"}
            buttonText="Update handover notes"
            postURL={`${baseURL}/shift/handover/${store.selectedShift._id}`}
            method="put"
            callback={updateHandoverNotes}
            validation={checkForChanges}
            hideSubmitButton={hideSubmitButton}
            ref={formRef}
            setParentIsLoading={handleChildLoadState}
        >
            <TextField multiline
                minRows={10}
                label="Handover notes"
                id="handover-notes"
                type="text"
                name="handoverNotes"
                placeholder={`During the next shift with ${store.selectedClient.firstName}, please follow up on...`}
                required
                mui="TextField" />
        </Form>
    )
});

export default HandoverNotesForm