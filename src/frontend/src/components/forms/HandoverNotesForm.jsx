import { useGlobalContext } from "../../utils/globalUtils";
import baseURL from "../../utils/baseUrl";
import { useHandleForm } from "../../utils/formUtils";
import Form from "./Form";
import { TextField } from "@mui/material";


const HandoverNotesForm = () => {
    const initialState = {
        inputs: {
            handoverNotes: ""
        },
        errors: []
    }

    const [form, setForm] = useHandleForm(initialState);
    const { store, dispatch } = useGlobalContext();

    const updateHandoverNotes = (response) => {
        dispatch({
            type: "setSelectedShift",
            data: {
                ...response,
                carer: store.selectedShift.carer
            }
        });
    }

    return (
        <Form form={form}
            setForm={setForm}
            legend="Add handover notes for this client's next shift"
            buttonText="Update handover notes"
            postURL={`${baseURL}/shift/handover/${store.selectedShift._id}`}
            method="put"
            callback={updateHandoverNotes}
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
}

export default HandoverNotesForm