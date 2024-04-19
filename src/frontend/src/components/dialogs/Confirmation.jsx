import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../utils/globalUtils";

import { useModalContext } from "../../utils/modalUtils"
import { ButtonPrimary, ButtonSecondary } from "../root/Buttons";
import Loader from "../logo/Loader";

import {
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    IconButton, Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/**
 * A resuable confirmation dialog that warns the user before taking a destructive action.
 * @param {Function} title The title text to display in the confirmation
 * @param {Function} text The body text to display in the confirmation
 * @param {Function} callback The function to execute if the user confirms the action
 * @param {String} modalId The id of the modal to open or close
 * @param {String} cancelText Custom text to display on the cancel button. Defaults to "Cancel".
 * @param {String} confirmText Custom text to display on the confirm button. Defaults to "Confirm"
 * @param {String} successAlert The alert message to display on successful confirmation
 * @param {Boolean} stayOpenOnConfirm If true, the dialog will stay open after confirmation
 * @param {String} closeText Custom text to display on the close button if stayOpenOnConfirm is true.
 * Defaults to "Close".
 * @param {Boolean} hasEndpoint If true, the modal will navigate 'back' in history on close.
 * @param {Function} afterConfirm A callback function to execute after confirmation. The passed
 * function will be called when the confirmation is closed.
 * @param {Boolean} noDismiss The close icon button will be removed from the confirmation
 * @param {Boolean} noRefresh If true, the `refreshCalendar` action will not be dispatched after confirmation.
 * @returns 
 */
const Confirmation = ({ title, text, callback, modalId, cancelText, confirmText, primaryButtonStartIcon,
    secondaryButtonStartIcon, closeButtonStartIcon, successAlert, stayOpenOnConfirm, closeText, hasEndpoint,
    afterConfirm, noDismiss, noRefresh, children, ...rest }) => {
    const { dispatch } = useGlobalContext();
    const { modalStore, modalDispatch } = useModalContext();
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [alert, setAlert] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const closeConfirmation = useCallback(() => {
        modalDispatch({
            type: "close",
            data: "confirmation",
            id: modalId
        });
        if (isConfirmed) {
            setTimeout(() => {
                if (afterConfirm) {
                    afterConfirm();
                }
                setIsConfirmed(false);
            }, 200);
        }
        if (hasEndpoint) {
            navigate(-1);
        }
        setTimeout(() => {
            setAlert({});
        }, 200);
    }, [modalDispatch, modalId, isConfirmed, afterConfirm, hasEndpoint, navigate]);

    const handleConfirm = useCallback(async () => {
        async function invokeCallback() {
            try {
                await Promise.resolve(callback());
                if (!stayOpenOnConfirm) {
                    closeConfirmation();
                } else {
                    setIsConfirmed(true);
                    if (successAlert) {
                        setAlert({
                            severity: "success",
                            message: successAlert
                        });
                    }
                }
            } catch (error) {
                setAlert({
                    severity: "error",
                    message: error.message
                });
            }
        }
        setIsLoading(true);
        await invokeCallback();
        setIsLoading(false);
        if (!noRefresh) {
            dispatch({
                type: "refreshCalendar"
            });
        }
    }, [callback, successAlert, closeConfirmation, stayOpenOnConfirm, dispatch, noRefresh]);

    return (
        <Dialog
            maxWidth="xs"
            open={modalStore.confirmationIsOpen && modalStore.confirmationId === modalId}
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
            <DialogTitle variant="h3" sx={{ pt: 5 }}>{title}</DialogTitle>
            <DialogContent sx={{ pb: 1 }}>
                {isLoading ? <Loader /> :
                    <>
                        <DialogContentText>
                            {text}
                        </DialogContentText>
                        {children}
                        {Object.keys(alert).length > 0 ?
                            <Alert severity={alert.severity} sx={{ mt: 2 }}>
                                {alert.message}
                            </Alert>
                            : null}
                    </>
                }
            </DialogContent>
            <DialogActions sx={{ pb: 2 }}>
                {!isConfirmed ? (
                    <>
                        <ButtonPrimary onClick={closeConfirmation} disabled={isLoading}
                            startIcon={primaryButtonStartIcon}>
                            {cancelText || "Cancel"}
                        </ButtonPrimary>
                        <ButtonSecondary onClick={handleConfirm} color="error" disabled={isLoading}
                            startIcon={secondaryButtonStartIcon}>
                            {confirmText || "Confirm"}
                        </ButtonSecondary>
                    </>
                ) : (
                    <ButtonPrimary onClick={closeConfirmation} startIcon={closeButtonStartIcon}>
                        {closeText || "Close"}
                    </ButtonPrimary>
                )}
            </DialogActions>
        </Dialog>
    )
}

export default Confirmation