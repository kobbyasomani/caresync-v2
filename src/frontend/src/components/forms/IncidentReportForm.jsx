import { useState, useCallback, forwardRef } from "react";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import baseURL from "../../utils/baseUrl";
import { useHandleForm } from "../../utils/formUtils";
import Form from "./Form";
import Loader from "../logo/Loader";

import { TextField } from "@mui/material";

const IncidentReportForm = forwardRef(({ setParentIsLoading, editMode, setEditMode, ...rest }, formRef) => {
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const [isLoading, setIsLoading] = useState(false);

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
    const createIncidentReport = (response) => {
        dispatch({
            type: "setSelectedShift",
            data: response
        });
        if (!editMode) {
            dispatch({
                type: "setSelectedIncidentReport",
                data: response.incidentReports[response.incidentReports.length - 1]
            });
        } else {
            dispatch({
                type: "setSelectedIncidentReport",
                data: response.incidentReports.filter(
                    report => report._id === store.selectedIncidentReport._id)[0]
            });
        }
        if (!editMode) {
            modalDispatch({
                type: "setActiveDrawer",
                data: "back"
            });
        }
        setEditMode(false);
    }

    return isLoading ? <Loader /> : (
        <Form form={form}
            ref={formRef}
            setForm={setForm}
            legend={editMode ? "Edit your incident report" : "Create a new incident report"}
            buttonText="Submit incident report"
            postURL={`${baseURL}/shift/reports/${store.selectedShift._id}`}
            callback={createIncidentReport}
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