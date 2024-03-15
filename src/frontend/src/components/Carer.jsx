import { useCallback } from "react";
import { useGlobalContext } from "../utils/globalUtils";
import { useModalContext } from "../utils/modalUtils";
import Confirmation from "./dialogs/Confirmation";

import {
    ListItem, ListItemAvatar, ListItemText,
    Avatar, IconButton, Tooltip, useTheme
} from "@mui/material"
import PersonIcon from '@mui/icons-material/Person';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const Carer = (props) => {
    const theme = useTheme();
    const { store } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const { carer, removeCarer } = props;
    const userIsCoordinator = store.user._id === store.selectedClient.coordinator._id;
    const userIsShiftCarer = store.user._id === carer._id;
    const modalId = `confirmRemoveCarer_${carer._id}`;

    const handleConfirmRemoveCarer = useCallback(() => {
        modalDispatch({
            type: "open",
            data: "confirmation",
            id: modalId
        });
    }, [modalDispatch, modalId]);

    return (
        <div>
            <ListItem sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: `${theme.shape.borderRadius}px`,
                p: "1rem"
            }}>
                {userIsCoordinator && removeCarer
                    && store.selectedClient.carers.map(carer => carer._id).includes(carer._id) ? (
                    <Tooltip title="Remove carer" placement="left">
                        <IconButton onClick={handleConfirmRemoveCarer}
                            sx={{ position: "absolute", top: "0.25rem", right: "0.25rem" }}>
                            <PersonRemoveIcon />
                        </IconButton>
                    </Tooltip>
                ) : null
                }

                <ListItemAvatar>
                    <Avatar sx={{ width: "2.7rem", height: "2.7rem", backgroundColor: theme.palette.primary.main }}>
                        <PersonIcon fontSize="large" />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primaryTypographyProps={{ fontSize: theme.typography.body1.fontSize }}
                    secondaryTypographyProps={{ fontSize: theme.typography.body1.fontSize }}
                    primary={<>{carer.firstName} {carer.lastName} {carer._id === store.selectedClient.coordinator._id ? <small>(coordinator)</small> : ""}</>}
                    secondary="(+61) 123 456 789"
                />
            </ListItem >

            <Confirmation title="Confirm Remove Carer"
                text={`Are you sure you want to remove ${userIsShiftCarer ? "yourself" : `${carer.firstName} ${carer.lastName}`} 
                from ${store.selectedClient.firstName} ${store.selectedClient.lastName}'s care team?
                ${userIsCoordinator && userIsShiftCarer ? "You will be removed as a carer but remain the coordinator for this client." : ""}`}
                callback={removeCarer}
                modalId={modalId}
                sx={{ ml: { sm: "2.5rem" } }}
                cancelText="Keep carer"
                confirmText="Remove"
            />
        </div>
    )
}

export default Carer