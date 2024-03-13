import React, { useState, useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { getUser } from "../../utils/apiUtils";
import Modal from "../Modal";
import { ButtonPrimary, ButtonSecondary } from "../root/Buttons";
import Loader from "../logo/Loader";

import {
    Typography, useTheme, Alert,
    Table, TableBody, TableRow, TableCell
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';

const MyAccount = () => {
    const { store } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [userData, setUserData] = useState({});

    const theme = useTheme();
    const navigate = useNavigate();

    const handleCloseMyAccountModal = useCallback(() => {
        modalDispatch({
            type: "close",
            data: "modal"
        });
        navigate(-1);
    }, [modalDispatch, navigate]);

    const handleGetUserData = useCallback(async () => {
        getUser(store.user._id).then(user => {
            setUserData(user);
        }).catch(error => {
            setError(error.message);
        });
    }, [store.user]);

    useEffect(() => {
        handleGetUserData().then(() => setIsLoading(false));
    }, [setIsLoading, store.user, handleGetUserData]);

    return (
        <Modal modalId={"my-account"}
            title="My Account"
            text="View and modify your account information including your name, email address, and password."
            hasEndpoint
            actions={
                <>
                    {Object.keys(userData).length > 0 ? <ButtonPrimary>Edit account details</ButtonPrimary> : null}
                    <ButtonSecondary onClick={handleCloseMyAccountModal}>Close</ButtonSecondary>
                </>}
        >
            {isLoading ? <Loader />
                : Object.keys(userData).length < 1 ?
                    <>
                        <Alert severity="error">
                            {error ? error : "The user could not be fetched a this time."}
                        </Alert>
                        <ButtonPrimary startIcon={<RefreshIcon />} onClick={handleGetUserData}>
                            Try again
                        </ButtonPrimary>
                    </>
                    : <>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="body1" >
                                            <span style={{ color: theme.palette.primary.main }}>First name: </span>
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
                                        <Typography variant="body1">
                                            <span style={{ color: theme.palette.primary.main }}>Last name: </span>
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
                                        <Typography variant="body1">
                                            <span style={{ color: theme.palette.primary.main }}>Email: </span>
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
                                        <Typography variant="body1">
                                            <span style={{ color: theme.palette.primary.main }}>Password: </span>
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body1">
                                            ************
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Update your password if you want to access this demo account again after this session.
                            Demo accounts will be deleted automatically after 30 days.
                        </Typography>
                    </>
            }
        </Modal>
    )
}

export default MyAccount