import React from "react";
import { useCallback } from "react";

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
import CloseIcon from '@mui/icons-material/Close';

/**
 * A re-usable modal.
 * @param {string} title The title (h2) to be displayed in the modal.
 * @param {string} text Some descriptive text to be displayed above the modal content.
 * @param {*} actions Some action elements (e.g., buttons) to be displayed at the bottom of the modal.
 * @param {object} state The state and update function { state, setSate }.
 * @returns A modal element populated with the passed props.
 */
const Modal = ({ title, text, actions, state, children, ...rest }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const toggleModal = useCallback(() => {
        state.setIsOpen(!state.isOpen);
    }, [state]);

    return (
        <Dialog className={state.isOpen ? "modal open" : "modal closed"}
            fullScreen={fullScreen}
            open={state.isOpen}
            onClose={toggleModal}
            maxWidth="xs"
            aria-labelledby="modal"
            {...rest}>
            <DialogTitle id="modal" sx={{ pt: 3 }}>
                <Typography variant="h2" component="p" sx={{ fontWeight: "bold", mt: 1 }}>
                    {title || "Title goes here"}
                </Typography>
                <IconButton className="close-modal"
                    onClick={toggleModal}
                    sx={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 1 }}>
                    {text || "Text goes here"}
                </DialogContentText>
                {children || "Nested content goes here {children}"}
            </DialogContent>
            {/* <DialogActions>
                {actions || null}
            </DialogActions> */}
        </Dialog>
    );
}

export default Modal