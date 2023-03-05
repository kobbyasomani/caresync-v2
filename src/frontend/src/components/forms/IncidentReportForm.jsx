import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
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
    const { modalDispatch } = useModalContext();

    // After creating the incident report, update the selected shift and incident
    const createIncidentReport = (response) => {
        // console.log(response);
        dispatch({
            type: "setSelectedShift",
            data: response
        });
        dispatch({
            type: "setSelectedIncidentReport",
            data: response.incidentReports[response.incidentReports.length - 1]
        });
        modalDispatch({
            type: "setActiveDrawer",
            data: "back"
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