import { useSetModal } from "../utils/modalUtils";
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
const Modal = ({ title, text, actions, children, ...rest }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const { modalStore, modalDispatch } = useModalContext();
    const isOpen = modalStore.modalIsOpen;
    const dispatch = modalDispatch;

    return (
        <Dialog className={isOpen ? "modal open" : "modal closed"}
            fullScreen={fullScreen}
            open={isOpen}
            onClose={useSetModal(dispatch, "close")}
            maxWidth="xs"
            aria-labelledby="modal-title"
            {...rest}>
            <DialogTitle sx={{ pt: 3 }}>
                <Typography variant="h2" component="p" id="modal-title" sx={{ fontWeight: "bold", mt: 1 }}>
                    {title || modalStore.activeModal.title}
                </Typography>
                <IconButton className="close-modal"
                    onClick={useSetModal(dispatch, "close")}
                    sx={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    {text || modalStore.activeModal.text}
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