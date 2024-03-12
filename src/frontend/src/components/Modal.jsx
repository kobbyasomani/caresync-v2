import React from "react";
import { useNavigate } from "react-router-dom";

import { useCallback } from "react";
import { useModalContext } from "../utils/modalUtils";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    useMediaQuery,
    useTheme,
    IconButton,
    Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close";

/**
 * A re-usable modal.
 * @param {string} modalId The id of the modal. Used for targeting open/close actions when
 * multiple modals are rendered simultaneously.
 * @param {string} title The title (h2) to be displayed in the modal.
 * @param {string} text Descriptive text to be displayed above the modal content.
 * @param {object} alert An alert object to be displayed in the modal.
 * @param {*} actions Any additional action elements (e.g., buttons) to be displayed at the bottom of the modal.
 * @param {boolean} hasEndpoint If true, the modal will navigate 'back' in history on close.
 * @returns A modal element populated with the passed props and children.
 */
const Modal = ({ modalId, title, text, alert, actions, hasEndpoint, children, ...rest }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const { modalStore, modalDispatch } = useModalContext();
    const isOpen = modalStore.modalIsOpen;
    const navigate = useNavigate();

    const handleCloseModal = useCallback(() => {
        modalDispatch({
            type: "close",
            data: "modal",
            id: modalId
        });
        if (hasEndpoint) {
            navigate("/calendar");
        }
    }, [modalDispatch, modalId, hasEndpoint, navigate]);

    return (
        <Dialog className={isOpen ? "modal open" : "modal closed"}
            fullScreen={fullScreen}
            open={isOpen && modalId === modalStore.modalId}
            onClose={handleCloseModal}
            maxWidth="xs"
            aria-labelledby="modal-title"
            {...rest}>
            <DialogTitle sx={{ pt: 3 }}>
                <Typography variant="h2" component="p" id="modal-title" sx={{ fontWeight: "bold", mt: 3 }}>
                    {title || modalStore.activeModal.title}
                </Typography>
                <IconButton className="close-modal"
                    onClick={handleCloseModal}
                    sx={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    {text || modalStore.activeModal.text}
                </DialogContentText>
                {modalStore.activeModal?.alert}
                {children}
            </DialogContent>
            <DialogActions>
                {actions}
            </DialogActions>
        </Dialog>
    );
}

export default Modal