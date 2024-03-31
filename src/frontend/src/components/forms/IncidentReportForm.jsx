import { useState, useCallback, forwardRef } from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import { baseURL_API } from "../../utils/baseURL";
import { useHandleForm } from "../../utils/formUtils";
import Form from "./Form";
import Loader from "../logo/Loader";

import { TextField } from "@mui/material";
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';

const IncidentReportForm = forwardRef(({ setParentIsLoading, editMode, setEditMode, ...rest }, formRef) => {
    const { store, dispatch } = useGlobalContext();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // TODO: Make sure previously submitted reports do not persist when opening note creation forms
    const initialFormState = {
        inputs: {
            incidentReport: editMode ? store.selectedIncidentReport.incidentReportText : "",
            incidentId: editMode ? store.selectedIncidentReport._id : null
        },
        errors: []
    }
    const [form, setForm] = useHandleForm(initialFormState);

    const handleChildLoadState = useCallback((childIsLoading) => {
        setIsLoading(childIsLoading);
        if (setParentIsLoading) {
            setParentIsLoading(childIsLoading);
        }
    }, [setParentIsLoading]);

    const checkForChanges = useCallback((form) => {
        if (store.selectedIncidentReport.incidentReportText === form.inputs.incidentReport) {
            throw new Error("No changes have been made. Select \"Cancel\" to leave edit mode.");
        } else {
            // Continue
        }
    }, [store.selectedIncidentReport]);

    // After creating the incident report, update the selected shift and incident
    const handleCreateIncidentReport = (response) => {
        dispatch({
            type: "setSelectedShift",
            data: response
        });
        const incidentReport = response.incidentReports[response.incidentReports.length - 1];
        if (!editMode) {
            dispatch({
                type: "setSelectedIncidentReport",
                data: incidentReport
            });
            setTimeout(() => {
                navigate(`/calendar/shift-details/incident-reports/${incidentReport._id}`, { replace: true });
            }, 100);
        } else {
            dispatch({
                type: "setSelectedIncidentReport",
                data: response.incidentReports.filter(
                    report => report._id === store.selectedIncidentReport._id)[0]
            });
            setEditMode(false);
        }
    }

    return isLoading ? <Loader /> : (
        <Form form={form}
            ref={formRef}
            setForm={setForm}
            legend={editMode ? "Edit your incident report" : "Create a new incident report"}
            submitButtonText={<><PublishRoundedIcon /> Submit incident report</>}
            postURL={`${baseURL_API}/shift/reports/${store.selectedShift._id}`}
            callback={handleCreateIncidentReport}
            setParentIsLoading={handleChildLoadState}
            validation={checkForChanges}
            {...rest}
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
});

export default IncidentReportForm