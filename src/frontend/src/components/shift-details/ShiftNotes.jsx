import { useState, useCallback, useRef } from "react";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { updateShift } from "../../utils/apiUtils";
import ShiftNotesForm from "../forms/ShiftNotesForm";
import { ButtonDownload, ButtonUpload, ButtonPrimary, ButtonSecondary } from "../root/Buttons";
import Confirmation from "../dialogs/Confirmation";

import { Typography, Box, Stack, useTheme } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TaskIcon from '@mui/icons-material/Task';
import CancelIcon from '@mui/icons-material/Cancel';

const ShiftNotes = (props) => {
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const [editMode, setEditMode] = useState(false);
    const formRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const theme = useTheme();

    const { shiftUtils } = props;
    const modalId = `confirmClearShiftNotes_${store.selectedShift._id}`;

    const toggleEditMode = useCallback((override) => {
        setEditMode(override || !editMode);
    }, [editMode]);

    const handleChildLoadState = useCallback((childIsLoading) => {
        setIsLoading(childIsLoading);
    }, []);

    const updateShiftNotes = useCallback(() => {
        formRef.current.click();
    }, [formRef]);

    const confirmClearShiftNotes = useCallback(() => {
        modalDispatch({
            type: "open",
            data: "confirmation",
            id: modalId
        });
    }, [modalDispatch, modalId]);

    const clearShiftNotes = useCallback(async () => {
        const updatedShift = await updateShift(store.selectedShift._id, {
            shiftNotes: {}
        });
        dispatch({
            type: "setSelectedShift",
            data: updatedShift
        });
    }, [store.selectedShift._id, dispatch]);

    const renderContent = () => {
        if (Object.keys(store.selectedShift.shiftNotes).length > 0) {
            return (
                <>
                    {!editMode ? (
                        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                            {store.selectedShift.shiftNotes.shiftNotesText}
                        </Typography>
                    ) : null}
                    {shiftUtils.userIsShiftCarer && (shiftUtils.isInProgress || shiftUtils.isInEditWindow) ? (
                        editMode ? (
                            <>
                                <ShiftNotesForm
                                    editMode={editMode}
                                    setEditMode={setEditMode}
                                    hideSubmitButton
                                    ref={formRef}
                                    setParentIsLoading={handleChildLoadState}
                                />
                                <Stack direction="row" justifyContent="center" mt={4} gap={2}>
                                    <ButtonPrimary onClick={updateShiftNotes} disabled={isLoading}
                                        sx={{ margin: "0" }} startIcon={<TaskIcon />}>
                                        Save
                                    </ButtonPrimary>
                                    <ButtonSecondary onClick={() => toggleEditMode(false)} disabled={isLoading}
                                        sx={{ margin: "0" }} startIcon={<CancelIcon />}>
                                        Cancel
                                    </ButtonSecondary>
                                </Stack>
                            </>
                        ) : (
                            <Stack direction="row" justifyContent="center" mt={4} gap={2}>
                                <ButtonPrimary onClick={toggleEditMode}
                                    sx={{ margin: "0" }} startIcon={<EditIcon />}>
                                    Edit
                                </ButtonPrimary>
                                <ButtonSecondary onClick={confirmClearShiftNotes}
                                    sx={{ margin: "0" }} startIcon={<DeleteForeverIcon />}>
                                    Clear
                                </ButtonSecondary>
                            </Stack>
                        )
                    ) : null
                    }

                    <Confirmation
                        title="Confirm Clear Shift Notes"
                        text={`Are you sure you want to clear the shift notes for this shift?
                        They will be permanently deleted.`}
                        callback={clearShiftNotes}
                        modalId={modalId}
                        cancelText="Keep shift notes"
                        confirmText={<><DeleteForeverIcon /> Clear</>}
                    >
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            <span style={{ fontSize: "1.7rem", lineHeight: "100%", verticalAlign: "sub", color: theme.palette.primary.main }}>&ldquo; </span>
                            {store.selectedShift.shiftNotes.shiftNotesText.length <= 140 ?
                                store.selectedShift.shiftNotes.shiftNotesText
                                : <>{store.selectedShift.shiftNotes.shiftNotesText.slice(0, 140)} ...</>
                            }
                            <span style={{ fontSize: "1.7rem", lineHeight: "100%", verticalAlign: "sub", color: theme.palette.primary.main }}> &rdquo;</span>
                        </Typography>
                    </Confirmation>
                </>
            );
        }
        if (shiftUtils.userIsShiftCarer) {
            switch (true) {
                case shiftUtils.isInProgress || shiftUtils.isInEditWindow:
                    return <ShiftNotesForm />;
                case shiftUtils.isPending:
                    return (
                        <Typography variant="body1">
                            You'll be able to add shift notes once the shift starts.
                        </Typography>
                    );
                default: break;
            }
        }
        return (
            <Typography variant="body1"> There are no shift notes for this shift. </Typography>
        );

    };

    const renderHeaderButtons = () => {
        if (store.selectedShift.shiftNotes?.shiftNotesPDF) {
            return (
                <ButtonDownload
                    tooltip="Download Shift Notes"
                    filename="Shift Notes"
                    resourceURL={store.selectedShift.shiftNotes.shiftNotesPDF}
                />
            );
        } else if (store.selectedShift.shiftNotes?.shiftNotesText) {
            return (
                <ButtonUpload
                    tooltip="Upload Shift Notes to the cloud. You will be able to download them as a PDF file afterwards."
                    resource=""
                    destinationURL="/"
                    callback=""
                />
            )
        } else {
            return null;
        }
    }

    return (
        <>
            <Stack direction="row" alignItems="flex-end" sx={{ position: "relative" }}>
                <Typography variant="h3" component="p">Shift Notes</Typography>
                {renderHeaderButtons()}
            </Stack>
            <Box sx={{ mt: 1 }}>
                {renderContent()}
            </Box>
        </>
    )
}

export default ShiftNotes