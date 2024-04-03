import React, { useCallback, useState, forwardRef } from "react";

import { useGlobalContext } from "../../utils/globalUtils";
import { baseURL_API } from "../../utils/baseURL";
import { useHandleForm } from "../../utils/formUtils";
import Form from "./Form";
import Loader from "../logo/Loader";

import { TextField } from "@mui/material";
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';

const ShiftNotesForm = forwardRef(({ editMode, setEditMode, hideSubmitButton, setParentIsLoading }, formRef) => {
    const { store, dispatch } = useGlobalContext();
    const initialFormState = {
        inputs: {
            shiftNotes: editMode ? store.selectedShift.shiftNotes.shiftNotesText : ""
        },
        errors: []
    }
    const [form, setForm] = useHandleForm(initialFormState);
    const [isLoading, setIsLoading] = useState(false);

    const handleChildLoadState = useCallback((childIsLoading) => {
        setIsLoading(childIsLoading);
        if (setParentIsLoading) {
            setParentIsLoading(childIsLoading);
        }
    }, [setParentIsLoading]);

    const checkForChanges = useCallback((form) => {
        if (store.selectedShift.shiftNotes?.shiftNotesText === form.inputs.shiftNotes) {
            throw new Error("No changes have been made. Select \"Cancel\" to leave edit mode.");
        } else {
            // Continue
        }
    }, [store.selectedShift.shiftNotes?.shiftNotesText]);

    const submitShiftNotes = useCallback((response) => {
        dispatch({
            type: "setSelectedShift",
            data: response
        });
        if (editMode) {
            setEditMode(false);
        }
    }, [dispatch, editMode, setEditMode]);

    return isLoading ? <Loader /> : (
        <Form form={form}
            setForm={setForm}
            legend={editMode ? "Edit your shift notes" : "Add and submit your shift notes"}
            submitButtonText={<><PublishRoundedIcon />Submit shift notes</>}
            postURL={`${baseURL_API}/shift/notes/${store.selectedShift._id}`}
            callback={submitShiftNotes}
            validation={checkForChanges}
            hideSubmitButton={hideSubmitButton}
            ref={formRef}
            setParentIsLoading={handleChildLoadState}
        >
            <TextField multiline
                minRows={10}
                label="Shift notes"
                id="shift-notes"
                type="text"
                name="shiftNotes"
                placeholder="Today, the client was feeling..."
                required
                mui="TextField" />
        </Form>
    )
});

export default ShiftNotesForm