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
    const userIsCoordinator = store.user._id === store.selectedClient.coordinator;
    const userIsShiftCarer = store.user._id === carer._id;

    const confirmRemoveCarer = useCallback(() => {
        modalDispatch({
            type: "open",
            data: "confirmation",
            id: carer._id
        });
    }, [modalDispatch, carer._id]);

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
                        <IconButton onClick={confirmRemoveCarer}
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
                    primary={<>{carer.firstName} {carer.lastName} {carer._id === store.selectedClient.coordinator ? <small>(coordinator)</small> : ""}</>}
                    secondary="(+61) 123 456 789"
                />
            </ListItem >

            <Confirmation title="Remove Carer"
                text={`Are you sure you want to remove ${userIsShiftCarer ? "yourself" : `${carer.firstName} ${carer.lastName}`} 
                from ${store.selectedClient.firstName} ${store.selectedClient.lastName}'s care team?
                ${userIsCoordinator && userIsShiftCarer ? "You will be removed as a carer but remain the coordinator for this client." : ""}`}
                callback={removeCarer}
                modalId={carer._id}
                sx={{ ml: { sm: "2.5rem" } }}
            />
        </div>
    )
}

export default Carer