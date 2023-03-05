import { useCallback } from "react";
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
const Confirmation = ({ title, text, callback, ...rest }) => {
    const { modalStore, modalDispatch } = useModalContext();

    const closeConfirmation = useCallback(() => {
        modalDispatch({
            type: "close",
            data: "confirmation"
        });
    }, [modalDispatch]);

    const handleClick = useCallback(() => {
        callback();
        closeConfirmation();
    }, [callback, closeConfirmation]);

    return (
        <>
            <Dialog
                open={modalStore.confirmationIsOpen}
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
                </DialogContent>
                <DialogActions>
                    <ButtonSecondary onClick={closeConfirmation}>
                        Cancel
                    </ButtonSecondary>
                    <ButtonPrimary onClick={handleClick}>
                        Confirm
                    </ButtonPrimary>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Confirmation