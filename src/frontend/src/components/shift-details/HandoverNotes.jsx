import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { updateShift } from "../../utils/apiUtils";
import HandoverNotesForm from "../forms/HandoverNotesForm";
import Confirmation from "../dialogs/Confirmation";
import { ButtonPrimary, ButtonSecondary } from "../root/Buttons";

import { Typography, Box, Stack, useTheme, Fade, Grow, Breadcrumbs } from "@mui/material";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TaskIcon from '@mui/icons-material/Task';
import CancelIcon from '@mui/icons-material/Cancel';

const HandoverNotes = () => {
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const { shiftUtils } = store;
    const modalId = `confirmClearHandoverNotes_${store.selectedShift._id}`;
    const theme = useTheme();

    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef(null);

    const toggleEditMode = useCallback((override) => {
        setEditMode(override || !editMode);
    }, [editMode]);

    const handleChildLoadState = useCallback((childIsLoading) => {
        setIsLoading(childIsLoading);
    }, []);

    const updateHandoverNotes = useCallback(() => {
        formRef.current.click();
    }, [formRef]);

    const confirmClearHandoverNotes = useCallback(() => {
        modalDispatch({
            type: "open",
            data: "confirmation",
            id: modalId
        });
    }, [modalDispatch, modalId]);

    const clearHandoverNotes = useCallback(async () => {
        const updatedHandover = await updateShift(store.selectedShift._id, {
            handoverNotes: ""
        });
        dispatch({
            type: "setSelectedShift",
            data: updatedHandover
        });
    }, [store.selectedShift._id, dispatch]);

    const renderContent = () => {
        // Handover is editable when user is the carer and:
        // 1. The shift is still in progress
        // 2. The shift is in the edit window and the next shift has not started
        // 3. The shift is the last shift for the client (no next shift exists)
        if (store.selectedShift.handoverNotes) {
            return (
                <>
                    {!editMode ? (
                        <>
                            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                                {store.selectedShift.handoverNotes}
                            </Typography>
                            {shiftUtils.userIsShiftCarer
                                && (shiftUtils.isInProgress || shiftUtils.isInEditWindow) ?

                                <Stack direction="row" justifyContent="center" mt={4} gap={2}>
                                    <ButtonPrimary onClick={toggleEditMode}
                                        sx={{ margin: "0" }} startIcon={<EditRoundedIcon />}>
                                        Edit
                                    </ButtonPrimary>
                                    <ButtonSecondary onClick={confirmClearHandoverNotes}
                                        sx={{ margin: "0" }} startIcon={<DeleteForeverIcon />}>
                                        Clear
                                    </ButtonSecondary>
                                </Stack>
                                : null
                            }
                        </>
                    ) : (
                        <>
                            <HandoverNotesForm
                                editMode={editMode}
                                setEditMode={setEditMode}
                                hideSubmitButton
                                ref={formRef}
                                setParentIsLoading={handleChildLoadState}
                            />
                            <Stack direction="row" justifyContent="center" mt={4} gap={2}>
                                <ButtonPrimary onClick={updateHandoverNotes} disabled={isLoading}
                                    sx={{ margin: "0" }} startIcon={<TaskIcon />}>
                                    Save
                                </ButtonPrimary>
                                <ButtonSecondary onClick={() => toggleEditMode(false)} disabled={isLoading}
                                    sx={{ margin: "0" }} startIcon={<CancelIcon />}>
                                    Cancel
                                </ButtonSecondary>
                            </Stack>
                        </>
                    )}
                </>

            )
        }
        if (shiftUtils.userIsShiftCarer) {
            switch (true) {
                case shiftUtils.isInProgress
                    || shiftUtils.isInEditWindow
                    || (shiftUtils.isLastShift && shiftUtils.hasEnded):
                    return <HandoverNotesForm />;
                case shiftUtils.isPending:
                    return (
                        <Typography variant="body1">
                            You'll be able to add handover notes once the shift starts.
                        </Typography>
                    );
                default: break;
            }
        }
        return (
            <Typography variant="body1">
                There are no handover notes for this shift.
            </Typography>
        );
    }

    return (
        <>
            <Fade in={true}>
                <Box>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link to="/calendar/shift-details/">Shift details</Link>
                        <Typography>Handover</Typography>
                    </Breadcrumbs>
                    <Typography variant="h3" mt={2}>Handover Notes</Typography>
                </Box>
            </Fade>
            <Grow in={true}>
                <Box sx={{ mt: 1 }}>
                    {renderContent()}
                </Box >
            </Grow>
            <Confirmation
                title="Confirm Clear Shift Handover Notes"
                text={`Are you sure you want to clear the handover notes for this shift?
                        They will be permanently deleted.`}
                callback={clearHandoverNotes}
                modalId={modalId}
                cancelText="Keep handover"
                confirmText={<><DeleteForeverIcon /> Clear</>}
            >
                {store.selectedShift.handoverNotes ?
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        <span style={{ fontSize: "1.7rem", lineHeight: "100%", verticalAlign: "sub", color: theme.palette.primary.main }}>&ldquo; </span>
                        {store.selectedShift.handoverNotes.length <= 140 ?
                            store.selectedShift.handoverNotes
                            : <>{store.selectedShift.handoverNotes.slice(0, 140)} ...</>
                        }
                        <span style={{ fontSize: "1.7rem", lineHeight: "100%", verticalAlign: "sub", color: theme.palette.primary.main }}> &rdquo;</span>
                    </Typography>
                    : null}
            </Confirmation>
        </>
    )
}

export default HandoverNotes