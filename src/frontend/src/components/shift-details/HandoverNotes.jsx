import { useState, useRef, useCallback } from "react";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { updateShift } from "../../utils/apiUtils";
import HandoverNotesForm from "../forms/HandoverNotesForm";
import Confirmation from "../dialogs/Confirmation";
import { ButtonPrimary, ButtonSecondary } from "../root/Buttons";

import { Typography, Box, Stack } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TaskIcon from '@mui/icons-material/Task';
import CancelIcon from '@mui/icons-material/Cancel';

const HandoverNotes = (props) => {
    const { store, dispatch } = useGlobalContext();
    const { setValue: modalDispatch } = useModalContext();
    const { shiftUtils } = props;
    const modalId = `confirmClearHandoverNotes_${store.selectedShift._id}`;

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
                                        sx={{ margin: "0" }} startIcon={<EditIcon />}>
                                        Edit handover notes
                                    </ButtonPrimary>
                                    <ButtonSecondary onClick={confirmClearHandoverNotes}
                                        sx={{ margin: "0" }} startIcon={<DeleteForeverIcon />}>
                                        Clear handover notes
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
                                    Save handover notes
                                </ButtonPrimary>
                                <ButtonSecondary onClick={() => toggleEditMode(false)} disabled={isLoading}
                                    sx={{ margin: "0" }} startIcon={<CancelIcon />}>
                                    Cancel edit
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
            <Typography variant="h3" component="p">Handover Notes</Typography>
            <Box sx={{ mt: 1 }}>
                {renderContent()}
            </Box >

            <Confirmation
                title="Confirm Clear Handover Notes"
                text={`Are you sure you want to clear the handover notes for this shift?
                        They will be permanently deleted.`}
                callback={clearHandoverNotes}
                modalId={modalId}
                cancelText="Keep notes"
                confirmText={<><DeleteForeverIcon /> Clear handover notes</>}
            />
        </>
    )
}

export default HandoverNotes