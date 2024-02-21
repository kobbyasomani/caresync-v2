import { useCallback, useState } from "react";
import { useModalContext } from "../../utils/modalUtils"
import { ButtonPrimary, ButtonSecondary } from "../root/Buttons";

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

/**
 * A resuable confirmation modal that warns the user before taking a destructive action.
 * @param {function} title The title text to display in the confirmation.
 * @param {function} text The body text to display in the confirmation.
 * @param {function} callback The function to execute if the user confirms.
 * @returns 
 */
const Confirmation = ({ title, text, callback, modalId, cancelText, confirmText, children,
    stayOpen, afterConfirm, ...rest }) => {
    const { modalStore, modalDispatch } = useModalContext();
    const [isConfirmed, setIsConfirmed] = useState(false);

    const closeConfirmation = useCallback(() => {
        modalDispatch({
            type: "close",
            data: "confirmation",
            id: modalId
        });
        if (isConfirmed) {
            afterConfirm();
        }
    }, [modalDispatch, modalId, isConfirmed, afterConfirm]);

    const handleConfirm = useCallback(() => {
        callback();
        if (!stayOpen) {
            closeConfirmation();
        } else {
            setIsConfirmed(true);
        }
    }, [callback, closeConfirmation, stayOpen]);

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
                <DialogTitle variant="h3">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {text}
                    </DialogContentText>
                    {children}
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