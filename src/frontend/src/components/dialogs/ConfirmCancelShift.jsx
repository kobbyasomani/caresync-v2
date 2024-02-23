import React from "react";
import { useState, useCallback } from "react";

import baseURL from "../../utils/baseUrl";
import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { getAllShifts } from "../../utils/apiUtils";

import Confirmation from "./Confirmation";

import {
    Alert, Box, Typography,
    TableContainer, Table, TableBody, TableRow, TableCell
} from "@mui/material";
import EventBusyIcon from '@mui/icons-material/EventBusy';


export const ConfirmCancelShift = () => {
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const [alert, setAlert] = useState({});
    const [isCancelled, setIsCancelled] = useState(false);
    // TODO: Clear cancel shift dialog state after shift is deleted
    const cancelShift = useCallback(() => {
        fetch(`${baseURL}/shift/${store.selectedShift._id}`, {
            credentials: "include",
            method: "DELETE"
        }).then((response) => {
            if (response.status === 200) {
                setAlert({ severity: "success", message: "The shift has been cancelled." });
                setIsCancelled(true);
            } else {
                setAlert({ severity: "error", message: "The shift could not be cancelled. Please try again later." })
            }
        }).then(() => {
            return getAllShifts(store.selectedClient._id);
        }).then(shifts => {
            modalDispatch({
                type: "close",
                data: "drawer"
            });
            dispatch({
                type: "setShifts",
                data: shifts
            });
        }).catch((error) => { setAlert({ error: error.message }) });
    }, [dispatch, modalDispatch, store.selectedClient._id, store.selectedShift._id]);

    const afterConfirm = useCallback(() => {
        dispatch({
            type: "clearSelectedShift",
        });
        setAlert({});
        setIsCancelled(false);
    }, [dispatch]);

    return Object.keys(store.selectedShift).length > 0 ? (
        <Confirmation title={isCancelled ? "Shift Cancelled" : "Confirm Cancel Shift"}
            text={isCancelled ? "The below shift has been cancelled." : `Are you sure you want to cancel this shift? It will be permanently removed from 
${store.selectedClient.firstName} ${store.selectedClient.lastName}'s calendar.`}
            callback={cancelShift}
            modalId={`confirmCancelShift_${store.selectedShift._id}`}
            sx={{ ml: { sm: "2.5rem" } }}
            confirmText={<><EventBusyIcon />&nbsp;Cancel shift</>}
            cancelText="Keep shift"
            stayOpenOnConfirm
            afterConfirm={afterConfirm}
        >
            <Box mt={2}>
                <Typography variant="body1">
                    <strong>Shift summary</strong>
                </Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Client</TableCell>
                                <TableCell>{store.selectedClient.firstName} {store.selectedClient.lastName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Start</TableCell>
                                <TableCell>{new Date(store.selectedShift.shiftStartTime).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>End</TableCell>
                                <TableCell>{new Date(store.selectedShift.shiftEndTime).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Carer</TableCell>
                                <TableCell>{store.selectedShift.carer.firstName} {store.selectedShift.carer.lastName}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            {Object.keys(alert).length > 0 ? (
                <Alert severity={alert.severity}>
                    {alert.message}
                </Alert>
            ) : (null)}
        </Confirmation>
    ) : null;
}

export default ConfirmCancelShift;