import React from "react";
import { useGlobalContext } from "../../utils/globalUtils";
import baseURL from "../../utils/baseUrl";
import { useHandleForm } from "../../utils/formUtils";
import Form from "./Form";
import { TextField } from "@mui/material";


const ShiftNotesForm = () => {
    const initialState = {
        inputs: {
            shiftNotes: ""
        },
        errors: []
    }

    const [form, setForm] = useHandleForm(initialState);
    const { store, dispatch } = useGlobalContext();

    const submitShiftNotes = (response) => {
        dispatch({
            type: "setSelectedShift",
            data: response
        });
        // TODO: Preserve line breaks in stored notes
    }

    return (
        <Form form={form}
            setForm={setForm}
            legend="Add and submit your shift notes"
            buttonText="Submit shift notes"
            postURL={`${baseURL}/shift/notes/${store.selectedShift._id}`}
            callback={submitShiftNotes}
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
}

export default ShiftNotesForm