import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TimePicker from "../DateTimePicker";
import dayjs from "dayjs";

import { useGlobalContext } from "../../utils/globalUtils";
import { useHandleForm } from "../../utils/formUtils";
import { useModalContext } from "../../utils/modalUtils";
import { plusHours } from "../../utils/dateUtils";
import baseURL from "../../utils/baseUrl";
import { getCarers } from "../../utils/apiUtils";
import Form from "./Form";
import { ButtonPrimary, ButtonSecondary, ButtonAddCarer } from "../root/Buttons";
import Loader from "../logo/Loader";
import Modal from "../Modal";

import {
    TextField, Stack, useTheme, useMediaQuery,
    FormControl, Select, InputLabel, MenuItem
} from "@mui/material";
import EditCalendarRoundedIcon from '@mui/icons-material/EditCalendarRounded';
import MoreTimeIcon from '@mui/icons-material/MoreTime';

export const AddShiftForm = ({ newShiftCreated, setNewShiftCreated }) => {
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const [modalData, setModalData] = useState({});
    const modalId = "add-shift";
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const theme = useTheme();
    const xsScreen = useMediaQuery(theme.breakpoints.down("sm"));

    /**
     * Returns whether or not the given start and end times overlap an existing shift.
     * @param {Date} newShiftStart The start time of the proposed shift
     * @param {Date} newShiftEnd The end time of the proposed shift
     * @param {Boolean} throwError If true, will throw an error message containing the
     * overlapping shift information when an overlap is found, rather than returning true.
     */
    const shiftsOverlap = useCallback((newShiftStart, newShiftEnd, throwError) => {
        let overlap = false;
        for (let shift of store.shifts) {
            const start = new Date(shift.shiftStartTime);
            const end = new Date(shift.shiftEndTime);
            if ((newShiftStart < end) && (newShiftEnd > start)) {
                overlap = true;
                if (throwError) {
                    throw new Error(`The shift times overlap an existing shift for this client: 
                    ${start.toLocaleString("en-AU", { dateStyle: "long", timeStyle: "short" }).replace("at", "from")} –
                    ${end.toLocaleTimeString("en-AU", { timeStyle: "short" })} with carer ${shift.carer.firstName} ${shift.carer.lastName[0]}.`);
                }
            }
        }
        return overlap;
    }, [store.shifts]);

    /**
     * Returns an object containing the default shift start and end times as `Date` objects.
     * @returns {Object}
     */
    const getShiftTimeDefaults = useCallback(() => {
        const currentDate = new Date();
        const selectedDateStart = new Date(store.selectedDate.start);
        let defaultStart = selectedDateStart > currentDate ?
            plusHours(selectedDateStart, 7)
            : new Date(new Date(currentDate).setHours(0, 0, 0, 0));
        let defaultEnd = plusHours(defaultStart, 8);

        if (store.shifts.length > 0 || defaultStart < currentDate) {
            /* Check for overlapping shifts and adjust times forward by one hour
            until a free 8-hour timespan is found. */
            while (shiftsOverlap(defaultStart, defaultEnd) || defaultStart < currentDate) {
                defaultStart = plusHours(defaultStart, 1);
                defaultEnd = plusHours(defaultEnd, 1);
            }
        }
        return { start: dayjs(defaultStart).$d, end: dayjs(defaultEnd).$d }
    }, [store.shifts, store.selectedDate, shiftsOverlap])

    // Set the initial form and alert state
    const [defaultShiftTime, setDefaultShiftTime] = useState(getShiftTimeDefaults());
    const [initialState] = useState({
        inputs: {
            carerID: store.selectedClient.carers?.length > 0 ? store.selectedClient.carers[0]?._id : "",
            shiftStartTime: defaultShiftTime.start,
            shiftEndTime: defaultShiftTime.end,
            coordinatorNotes: ""
        },
        errors: []
    });
    const [form, setForm] = useHandleForm(initialState);
    const [alert, setAlert] = useState({});
    const clearAlert = useCallback(() => {
        setAlert({});
    }, []);
    const [carers, setCarers] = useState(store.selectedClient.carers || []);

    // Handle carer selection
    const selectCarer = useCallback((event) => {
        setForm({
            type: "setForm",
            name: "carerID",
            value: event.target.value
        });
    }, [setForm]);

    // Handle time selection
    const setShiftTime = useCallback((pos, newStartTime) => {
        setForm({
            type: "setForm",
            name: `shift${pos}Time`,
            value: newStartTime.$d
        })
    }, [setForm]);

    // Additional validation
    const validation = useCallback((form) => {
        // Shift must end after it starts
        if (form.inputs.shiftStartTime > form.inputs.shiftEndTime) {
            throw new Error("Shift end time cannot be before shift start time.")
        }
        // Shift must have a duration > 0
        if (form.inputs.shiftStartTime.toLocaleString()
            === form.inputs.shiftEndTime.toLocaleString()) {
            throw new Error("Shift cannot have the same start time and end time.")
        }
        // New Shift cannot start in the past
        if (form.inputs.shiftStartTime < new Date()) {
            throw new Error("Shift start time cannot be in the past.")
        }
        // New Shift cannot end in the past
        if (form.inputs.shiftEndTime < new Date()) {
            throw new Error("Shift end time cannot be in the past.")
        }
        // New shift should not everlap existing shifts
        shiftsOverlap(form.inputs.shiftStartTime, form.inputs.shiftEndTime, true);
    }, [shiftsOverlap]);

    // Update shifts after successfully posting new shift
    const handleUpdateShifts = useCallback((shift) => {
        setIsLoading(true);
        setNewShiftCreated(false);
        clearAlert();
        // Set the newly created shift as the selected shift
        dispatch({
            type: "setSelectedShift",
            data: shift
        });
        // Update client shifts from the database
        fetch(`${baseURL}/shift/${store.selectedClient._id}`, {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(response => response.json())
            .then((shifts) => {
                dispatch({
                    type: "setShifts",
                    data: shifts
                })
                // Show success alert
                setAlert({
                    message: `A new shift was added for 
                ${store.selectedClient.firstName} ${store.selectedClient.lastName} on 
                ${new Date(shift.shiftStartTime).toLocaleDateString("en-AU", { dateStyle: "medium" })} 
                from ${new Date(shift.shiftStartTime).toLocaleTimeString("en-AU", { timeStyle: "short" })} 
                – ${new Date(shift.shiftEndTime).toLocaleTimeString("en-AU", { timeStyle: "short" })} 
                with carer ${shifts[shifts.length - 1].carer.firstName} ${shifts[shifts.length - 1].carer.lastName}.`,
                    severity: "success"
                });
                // Finished loading
                setNewShiftCreated(true);
                setIsLoading(false);
            });
    }, [dispatch, store.selectedClient, clearAlert, setNewShiftCreated]);

    // Close the modal and open the shift details drawer with the new shift
    const handleManageShift = useCallback(() => {
        modalDispatch({
            type: "close",
            data: "modal",
            id: modalId
        });
        navigate("/calendar/shift-details");
        setTimeout(() => {
            setNewShiftCreated(false);
            clearAlert();
            modalDispatch({
                type: "open",
                data: "drawer"
            });
        }, 200);
    }, [modalDispatch, navigate, clearAlert, setNewShiftCreated]);

    // Add logged-in user to the care team if they are the coordinator
    const addCoordinatorAsCarer = useCallback(() => {
        setIsLoading(true);
        axios.post("/carer/add-coordinator-as-carer", {
            "coordinatorID": store.user._id,
            "clientID": store.selectedClient._id
        }).then(response => {
            setAlert({
                message: "You have been added to the care team.",
                severity: "success"
            });
            getCarers(store.selectedClient._id).then(carers => {
                setCarers(carers);
                dispatch({
                    type: "setCarers",
                    data: carers
                });
                setForm({
                    type: "setForm",
                    name: "carerID",
                    value: store.user._id
                });
                setIsLoading(false);
            });
        }).catch(error => setAlert({
            message: error.response.data.message,
            severity: "error"
        }
        ));
    }, [store.user._id, store.selectedClient._id, dispatch, setForm]);

    const populateModal = useCallback(() => {
        // Set shift creation modal text
        if (carers.length === 0) {
            // If the client has no assigned carers, prompt the user to invite some
            setModalData({
                title: "No carers assigned",
                text: `It looks like this client doesn't have any carers assigned yet.
                Add some before creating a shift.`
            });
        } else {
            setModalData({
                title: `New shift for ${defaultShiftTime.start.toLocaleDateString()}`,
                text: newShiftCreated ? "Manage your new shift or create another."
                    : "Enter the details for a new shift on this date.",
            });
        }
    }, [carers, defaultShiftTime.start, newShiftCreated]);

    const handleOnClose = useCallback(() => {
        clearAlert();
        setNewShiftCreated(false);
    }, [clearAlert, setNewShiftCreated]);

    const renderActionButtons = useCallback(() => {
        return <>
            <ButtonPrimary startIcon={<EditCalendarRoundedIcon />} onClick={handleManageShift}>
                Manage shift
            </ButtonPrimary >
            <ButtonSecondary startIcon={<MoreTimeIcon />} onClick={() => {
                setNewShiftCreated(false);
                clearAlert();
            }}>
                Create shift
            </ButtonSecondary>
        </>
    }, [clearAlert, handleManageShift, setNewShiftCreated]);

    useEffect(() => {
        populateModal();
    }, [store.selectedDate, populateModal]);

    useEffect(() => {
        const newDefaultTime = getShiftTimeDefaults();
        setDefaultShiftTime({
            start: newDefaultTime.start,
            end: newDefaultTime.end
        });
        setShiftTime("Start", dayjs(newDefaultTime.start));
        setShiftTime("End", dayjs(newDefaultTime.end));
    }, [getShiftTimeDefaults, setShiftTime]);

    return <Modal modalId={modalId}
        title={modalData.title}
        text={modalData.text}
        alert={{ severity: alert?.severity, message: alert?.message }}
        actions={newShiftCreated ?
            xsScreen ?
                <Stack direction="column" width="100%">
                    {renderActionButtons()}
                </Stack>
                : renderActionButtons()
            : null
        }
        onClose={handleOnClose}
    >
        {isLoading ? <Loader />
            : carers.length > 0 ? (
                <>
                    {!newShiftCreated ?
                        <Form form={form}
                            setForm={setForm}
                            legend="New shift details"
                            submitButtonText="Create shift"
                            postURL={`/shift/${store.selectedClient._id}`}
                            validation={validation}
                            callback={handleUpdateShifts}
                            initialState={initialState}
                        >
                            <label htmlFor="shiftStartTime" style={{ display: "none" }}>Shift Start Time</label>
                            <label htmlFor="shiftEndTime" style={{ display: "none" }}>Shift End Time</label>
                            <Stack spacing={2} sx={{ mt: 2, mb: 2 }}>
                                <TimePicker label="Shift Start Time"
                                    inputProps={{ name: "shiftStartTime", required: true }}
                                    time={form.inputs.shiftStartTime}
                                    setTime={setShiftTime}
                                    minDate={dayjs(new Date())}
                                />
                                <TimePicker label="Shift End Time"
                                    inputProps={{ name: "shiftEndTime", required: true }}
                                    time={form.inputs.shiftEndTime}
                                    setTime={setShiftTime}
                                    minDate={dayjs(new Date())}
                                />
                            </Stack>
                            <label htmlFor="carerID-input" style={{ display: "none" }}>Carer</label>
                            <FormControl fullWidth>
                                <InputLabel id="carer-select">Select Carer</InputLabel>
                                <Select
                                    labelId="carer-select"
                                    id="carer-select"
                                    label="Select Carer"
                                    required
                                    mui="Select"
                                    value={form.inputs.carerID}
                                    name="carerID"
                                    onChange={selectCarer}
                                    inputProps={{ id: "carerID-input" }}
                                >
                                    {carers.map(carer => {
                                        return (
                                            <MenuItem value={carer._id} key={carer._id}>
                                                {`${carer.firstName} ${carer.lastName}`}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            <TextField multiline
                                minRows={3}
                                label="Coordinator Notes"
                                id="coordinator-notes"
                                type="text"
                                name="coordinatorNotes"
                                placeholder="Some things to take note of during this shift are..."
                                mui="TextField" />
                        </Form>
                        : null
                    }
                </>
            ) : (
                // If the client has no assigned carers, prompt the user to invite some
                <Stack direction="row">
                    <ButtonAddCarer />
                    {store.selectedClient.coordinator._id === store.user._id
                        // If there are carers, check that user is not already a carer for the client
                        && ((store.selectedClient.carers?.length > 0
                            && !store.selectedClient.carers.some(obj => obj["_id"] === store.user._id))
                            // Or, if there are no carers
                            || store.selectedClient.carers?.length === 0
                            || !store.selectedClient.carers) ? (
                        <ButtonSecondary onClick={addCoordinatorAsCarer}>
                            Add yourself
                        </ButtonSecondary>
                    ) : null}
                </Stack>
            )}
    </Modal>
}

export default AddShiftForm;
