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

const Modal = ({ title, text, actions, children, state, ...rest }) => {
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
                <Typography variant="h2">{title || "Title goes here"}</Typography>
                <IconButton className="close-modal"
                    onClick={toggleModal}
                    sx={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
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