import { useGlobalContext } from "../../utils/globalUtils";
import baseURL from "../../utils/baseUrl";
import { useHandleForm } from "../../utils/formUtils";
import Form from "./Form";
import { TextField } from "@mui/material";


const IncidentReportForm = () => {
    const initialState = {
        inputs: {
            incidentReport: ""
        },
        errors: []
    }

    const [form, setForm] = useHandleForm(initialState);
    const { store, dispatch } = useGlobalContext();

    const createIncidentReport = (response) => {
        console.log(response);
        dispatch({
            type: "setSelectedShift",
            data: response
        });
    }

    return (
        <Form form={form}
            setForm={setForm}
            legend="Create a new incident report"
            buttonText="Submit incident report"
            postURL={`${baseURL}/shift/reports/${store.selectedShift._id}`}
            callback={createIncidentReport}
        >
            <TextField multiline
                minRows={10}
                label="Incident report"
                id="incident-report"
                type="text"
                name="incidentReport"
                placeholder="Today, the client had an incident where they..."
                required
                mui="TextField" />
        </Form>
    )
}

export default IncidentReportForm