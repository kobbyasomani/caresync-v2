import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useGlobalContext } from "../utils/globalUtils";
import { useModalContext } from "../utils/modalUtils";

import {
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    useMediaQuery, useTheme, IconButton, Alert, Grow
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close";

/**
 * A re-usable modal.
 * @param {String} modalId The id of the modal. Used for targeting open/close actions when
 * multiple modals are rendered simultaneously.
 * @param {String} title The title (h2) to be displayed in the modal.
 * @param {String} text Descriptive text to be displayed above the modal content.
 * @param {Object} alert An alert object to be displayed in the modal.
 * @param {String} alertPosition `top` (default) and `bottom` will display alerts
 * above or below the modal children respectively.
 * @param {*} actions Any additional action elements (e.g., buttons) to be displayed at the bottom of the modal.
 * @param {Boolean} hasEndpoint If true, the modal will navigate 'back' in history on close.
 * @param {Function} onClose A function to execute when the modal is closed.
 * @returns A modal element populated with the passed props and children.
 */
const Modal = ({ modalId, title, text, alert, alertPosition, actions,
    hasEndpoint, onClose, children, ...rest }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const { store } = useGlobalContext();
    const { modalStore, modalDispatch } = useModalContext();
    const [modalAlert, setModalAlert] = useState(alert || {});
    const isOpen = modalStore.modalIsOpen;
    const navigate = useNavigate();
    const location = useLocation();

    const handleCloseModal = useCallback(() => {
        modalDispatch({
            type: "close",
            data: "modal",
            id: modalId
        });
        setTimeout(() => {
            setModalAlert({});
            if (onClose) {
                onClose();
            }
        }, 200);
        if (hasEndpoint) {
            navigate(location.pathname.slice(0, location.pathname.lastIndexOf("/")));
        }
    }, [modalDispatch, modalId, hasEndpoint, navigate, location.pathname, onClose]);

    const renderAlert = useCallback(() => {
        if (modalAlert?.message) {
            return (
                <Grow in={true}>
                    <Alert severity={modalAlert.severity} sx={{ mt: 2, mb: 2 }}>
                        {modalAlert.message}
                    </Alert>
                </Grow>
            )
        }
    }, [modalAlert]);

    useEffect(() => {
        setModalAlert(alert);
    }, [alert]);

    useEffect(() => {
        if (!isOpen && !store.user.isNewUser) {
            handleCloseModal();
        }
    }, [isOpen, handleCloseModal, store.user.isNewUser]);

    return (
        <Dialog id={`dialog_${modalStore.modalId}`}
            className={isOpen ? "modal open" : "modal closed"}
            fullScreen={fullScreen}
            open={isOpen && modalId === modalStore.modalId}
            onClose={handleCloseModal}
            maxWidth="xs"
            aria-labelledby="modal-title"
            {...rest}>
            <DialogTitle variant="h2" sx={{ pt: 3, fontWeight: "bold", mt: 3 }} id="modal-title">
                {title || modalStore.activeModal.title}
                <IconButton className="close-modal"
                    onClick={handleCloseModal}
                    sx={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pb: 0 }}>
                <DialogContentText sx={{ mb: 2 }}>
                    {text || modalStore.activeModal.text}
                </DialogContentText>
                {alertPosition === "top" || !alertPosition ? renderAlert() : null}
                {children}
                {alertPosition === "bottom" ? renderAlert() : null}
            </DialogContent>
            <DialogActions sx={{ pt: 0, pb: 2.5 }}>
                {actions}
            </DialogActions>
        </Dialog>
    );
}

export default Modal