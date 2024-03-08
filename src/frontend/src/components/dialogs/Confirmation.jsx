import { useCallback, useState } from "react";
import { useModalContext } from "../../utils/modalUtils"
import { ButtonPrimary, ButtonSecondary } from "../root/Buttons";

import {
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    IconButton, Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/**
 * A resuable confirmation dialog that warns the user before taking a destructive action.
 * @param {function} title The title text to display in the confirmation
 * @param {function} text The body text to display in the confirmation
 * @param {function} callback The function to execute if the user confirms the action
 * @param {string} modalId The id of the modal to open or close
 * @param {string} cancelText The text to display on the cancel button
 * @param {string} confirmText The text to display on the confirm button
 * @param {string} successAlert The alert message to display on successful confirmation
 * @param {boolean} stayOpenOnConfirm If true, the dialog will stay open after confirmation
 * @param {function} afterConfirm A callback function to execute after confirmation
 * @returns 
 */
const Confirmation = ({ title, text, callback, modalId, cancelText, confirmText, successAlert,
    stayOpenOnConfirm, afterConfirm, noDismiss, children, ...rest }) => {
    const { modalStore, modalDispatch } = useModalContext();
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [alert, setAlert] = useState({});

    const closeConfirmation = useCallback(() => {
        modalDispatch({
            type: "close",
            data: "confirmation",
            id: modalId
        });
        if (isConfirmed) {
            if (afterConfirm) {
                afterConfirm();
            }
            setIsConfirmed(false);
        }
        setAlert({});
    }, [modalDispatch, modalId, isConfirmed, afterConfirm]);

    const handleConfirm = useCallback(() => {
        async function invokeCallback() {
            try {
                await Promise.resolve(callback());
                if (!stayOpenOnConfirm) {
                    setIsConfirmed(true);
                    closeConfirmation();
                } else {
                    setIsConfirmed(true);
                    setAlert({
                        severity: "success",
                        message: successAlert
                    });
                }
            } catch (error) {
                setAlert({
                    severity: "error",
                    message: error.message
                });
            }
        }
        invokeCallback();
    }, [callback, successAlert, closeConfirmation, stayOpenOnConfirm]);

    return (
        <>
            <Dialog
                maxWidth="xs"
                open={modalStore.confirmationIsOpen && modalStore.id === modalId}
                onClose={closeConfirmation}
                aria-labelledby={title}
                aria-describedby={text}
                {...rest}
            >
                {!noDismiss ? (
                    <IconButton className="close-modal"
                        onClick={closeConfirmation}
                        sx={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}>
                        <CloseIcon />
                    </IconButton>
                ) : null}
                <DialogTitle variant="h3" sx={{ paddingTop: 4 }}>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {text}
                    </DialogContentText>
                    {children}
                    {Object.keys(alert).length > 0 ?
                        <Alert severity={alert.severity} sx={{ mt: 2 }}>
                            {alert.message}
                        </Alert>
                        : null}
                </DialogContent>
                <DialogActions>
                    {!isConfirmed ? (
                        <>
                            <ButtonPrimary onClick={closeConfirmation}>
                                {cancelText || "Cancel"}
                            </ButtonPrimary>
                            <ButtonSecondary onClick={handleConfirm} color="error">
                                {confirmText || "Confirm"}
                            </ButtonSecondary>
                        </>
                    ) : (
                        <ButtonPrimary onClick={closeConfirmation}>
                            Close
                        </ButtonPrimary>
                    )}
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Confirmation