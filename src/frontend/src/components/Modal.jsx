import React from "react";
import { useCallback } from "react";
import { useModalContext } from "../utils/modalUtils";

import {
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useMediaQuery,
    useTheme,
    IconButton,
    Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close";

/**
 * A re-usable modal.
 * @param {string} title The title (h2) to be displayed in the modal.
 * @param {string} text Descriptive text to be displayed above the modal content.
 * @param {*} actions Any additional action elements (e.g., buttons) to be displayed at the bottom of the modal.
 * @returns A modal element populated with the passed props and children.
 */
const Modal = ({ title, text, alert, actions, children, ...rest }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const { modalStore, modalDispatch } = useModalContext();
    const isOpen = modalStore.modalIsOpen;

    const closeModal = useCallback(() => {
        modalDispatch({
            type: "close",
            data: "modal"
        });
    }, [modalDispatch]);

    return (
        <Dialog className={isOpen ? "modal open" : "modal closed"}
            fullScreen={fullScreen}
            open={isOpen}
            onClose={closeModal}
            maxWidth="xs"
            aria-labelledby="modal-title"
            {...rest}>
            <DialogTitle sx={{ pt: 3 }}>
                <Typography variant="h2" component="p" id="modal-title" sx={{ fontWeight: "bold", mt: 3 }}>
                    {title || modalStore.activeModal.title}
                </Typography>
                <IconButton className="close-modal"
                    onClick={closeModal}
                    sx={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    {text || modalStore.activeModal.text}
                </DialogContentText>
                {modalStore.activeModal?.alert}
                {children || "Nested content goes here {children}"}
            </DialogContent>
            {/* <DialogActions>
                {actions || null}
            </DialogActions> */}
        </Dialog>
    );
}

export default Modal