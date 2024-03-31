import React, { useState, useCallback, useEffect, useRef, forwardRef } from "react"

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { getUser } from "../../utils/apiUtils";
import Modal from "../Modal";
import { ButtonPrimary, ButtonSecondary } from "../root/Buttons";
import Loader from "../logo/Loader";
import Form from "../forms/Form";
import { useHandleForm } from "../../utils/formUtils";
import { baseURL_API } from "../../utils/baseURL";

import {
    Typography, useTheme, Alert, TextField,
    Table, TableBody, TableRow, TableCell
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import TaskIcon from '@mui/icons-material/Task';

const EditAccountForm = forwardRef((
    { setParentIsLoading,
        userData,
        setUserData,
        setEditMode,
        handleGetUserData,
        setParentErrors,
        setParentAlert,
        children },
    formRef) => {
    const initialState = {
        inputs: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: "",
            confirmPassword: ""
        },
        errors: []
    }
    const { dispatch } = useGlobalContext();
    const [form, setForm] = useHandleForm(initialState);

    const handleChildLoadState = useCallback((childIsLoading, errors) => {
        if (setParentIsLoading) {
            setParentIsLoading(childIsLoading);
            if (errors) {
                setParentErrors(errors);
            }
        }
    }, [setParentIsLoading, setParentErrors]);

    const handleValidation = useCallback((form) => {
        // Check if any fields have changed
        let noChanges = true;
        for (const field of Object.keys(form.inputs)) {
            if (form.inputs[field] !== "" && form.inputs[field] !== userData[field]) {
                noChanges = false;
            }
        }
        if (noChanges) {
            throw new Error("No fields have been modified. Select 'Cancel' to leave edit mode.");
        }
        // Check if password is being changed
        if (form.inputs.password) {
            // Make sure a conifrmation has been added
            if (!form.inputs.confirmPassword) {
                throw new Error("Confirm your new password by typing it in the 'Confirm new password' field as well.");
            }
            // Make sure password confirmation matches
            if (form.inputs.password !== form.inputs.confirmPassword) {
                throw new Error("The password confirmation does not match the new password.");
            }
        }

    }, [userData]);

    const handleAfterSubmit = useCallback((json) => {
        // Check if all required user account fields were returned
        if (Object.keys(json)
            .every(key => ["_id", "firstName", "lastName", "email", "isConfirmed", "createdAt"]
                .includes(key))) {
            setUserData(json);
        } else {
            // If not, fetch them
            setUserData(handleGetUserData());
        }
        dispatch({
            type: "setUser",
            data: {
                _id: json._id,
                firstName: json.firstName,
                lastName: json.lastName
            }
        });
        setEditMode(false);
        setParentAlert({
            severity: "success",
            message: "Your account was successfully updated."
        });
    }, [setEditMode, setUserData, handleGetUserData, setParentAlert, dispatch]);

    return <Form form={form}
        ref={formRef}
        initialState={initialState}
        setForm={setForm}
        legend="Update your account details"
        hideSubmitButton
        postURL={`${baseURL_API}/user/my-account`}
        method="PUT"
        validation={handleValidation}
        callback={handleAfterSubmit}
        setParentIsLoading={handleChildLoadState}
        dontClear
    >
        <TextField
            label="First name"
            id="first-name"
            type="text"
            name="firstName"
            mui="TextField" />
        <TextField
            label="Last name"
            id="last-name"
            type="text"
            name="lastName"
            mui="TextField" />
        <TextField
            label="Email address"
            id="email"
            type="text"
            name="email"
            mui="TextField" />
        <TextField
            label="New password"
            id="new-password"
            type="password"
            name="password"
            mui="TextField" />
        <TextField
            label="Confirm new password"
            id="confirm-password"
            type="password"
            name="confirmPassword"
            mui="TextField" />
        {children}
    </Form>
});

const MyAccount = () => {
    const { store } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [formErrors, setFormErrors] = useState([]);
    const [alert, setAlert] = useState({});
    const [userData, setUserData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const formRef = useRef(null);

    const theme = useTheme();

    const handleCloseMyAccountModal = useCallback(() => {
        modalDispatch({
            type: "close",
            data: "modal"
        });
        setEditMode(false);
        setError("");
        setFormErrors([]);
        setAlert({});
    }, [modalDispatch]);

    const handleGetUserData = useCallback(async () => {
        getUser(store.user._id).then(user => {
            setUserData(user);
            setError("");
        }).catch(error => {
            setError(error.message);
        });
    }, [store.user]);

    const handleToggleEditMode = useCallback((value) => {
        setEditMode(prev => value ? value : !prev);
        setFormErrors([]);
        setAlert({});
    }, [setEditMode]);

    const handleUpdateAccount = useCallback(() => {
        setFormErrors([]);
        setAlert({});
        formRef.current.click();
    }, [formRef]);

    useEffect(() => {
        handleGetUserData().then(() => setIsLoading(false));
    }, [setIsLoading, store.user, handleGetUserData]);

    return (
        <Modal modalId={"my-account"}
            title="My Account"
            text="View and modify your account information including your name, email address, and password."
            actions={
                <>
                    {Object.keys(userData).length > 0 ?
                        editMode ? (
                            <>
                                <ButtonPrimary startIcon={<TaskIcon />}
                                    onClick={handleUpdateAccount}
                                    disabled={isLoading}>
                                    Save account details
                                </ButtonPrimary>
                                <ButtonSecondary onClick={() => handleToggleEditMode(false)}
                                    disabled={isLoading}>
                                    Cancel
                                </ButtonSecondary>
                            </>
                        ) : (<>
                            <ButtonPrimary startIcon={<EditRoundedIcon />}
                                onClick={() => handleToggleEditMode(true)}
                            >
                                Edit account details
                            </ButtonPrimary>
                            <ButtonSecondary onClick={handleCloseMyAccountModal}>Close</ButtonSecondary>
                        </>)
                        : null}
                </>}
        >
            {isLoading ? <Loader />
                : error ?
                    <>
                        <Alert severity="error">
                            {error ? error : "The user could not be fetched a this time."}
                        </Alert>
                        <ButtonPrimary startIcon={<RefreshIcon />} onClick={handleGetUserData}>
                            Try again
                        </ButtonPrimary>
                    </>
                    : editMode ?
                        <>
                            <EditAccountForm
                                setParentIsLoading={setIsLoading}
                                userData={userData}
                                setUserData={setUserData}
                                setEditMode={(...args) => handleToggleEditMode(...args)}
                                handleGetUserData={handleGetUserData}
                                ref={formRef}
                                setParentErrors={setFormErrors}
                                setParentAlert={setAlert}
                            >
                                {formErrors?.length > 0 ? (
                                    <div className="form-errors">
                                        <ul>
                                            {formErrors.map((error, index) => {
                                                return <li key={index}>{error}</li>
                                            })}
                                        </ul>
                                    </div>) : null
                                }
                            </EditAccountForm>
                        </>
                        : <>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="body1" >
                                                <span style={{ color: theme.palette.primary.main }}>First name</span>
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1" >
                                                {userData.firstName}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="body1" sx={{ color: theme.palette.primary.main }}>
                                                Last name
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">
                                                {userData.lastName}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="body1" sx={{ color: theme.palette.primary.main }}>
                                                Email
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">
                                                {userData.email}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="body1" sx={{ color: theme.palette.primary.main }}>
                                                Password
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">
                                                ************
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="body1" sx={{ color: theme.palette.primary.main }}>
                                                Signup date
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">
                                                {new Date(userData.createdAt).toLocaleDateString("en-AU", { dateStyle: "long" })}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Typography variant="body2" sx={{ mt: 2 }}>
                                Update your password if you want to access this demo account again after this session.
                                <strong> Demo accounts will be deleted automatically after 30 days.</strong>
                            </Typography>
                            {alert?.message ?
                                <Alert severity={alert.severity} sx={{ mt: 2 }}>
                                    {alert.message}
                                </Alert>
                                : null}
                        </>
            }
        </Modal>
    )
}

export default MyAccount