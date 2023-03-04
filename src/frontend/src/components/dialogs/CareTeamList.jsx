import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { ButtonPrimary } from "../root/Buttons";

import {
    List, ListItem, ListItemAvatar, ListItemText,
    Avatar, IconButton, Tooltip, useTheme
} from "@mui/material"
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const CareTeamList = () => {
    const { store } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const navigate = useNavigate();
    const theme = useTheme();

    const addCarer = useCallback(() => {
        modalDispatch({
            type: "setActiveModal",
            data: {
                title: "Invite a care team member",
                text: `Send an invitation to another user to join ${store.selectedPatient.firstName} 
                ${store.selectedPatient.lastName}'s care team. The user must have an existing 
                CareSync account.`
            }
        });
        navigate("/calendar/invite-carer");
    }, [modalDispatch, store.selectedPatient, navigate]);

    return (
        <>
            <List>
                <ListItem sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: `${theme.shape.borderRadius}px`,
                    p: "1rem"
                }}>
                    <Tooltip title="Remove carer" placement="left">
                        <IconButton sx={{ position: "absolute", top: "0.25rem", right: "0.25rem" }}>
                            <PersonRemoveIcon />
                        </IconButton>
                    </Tooltip>

                    <ListItemAvatar>
                        <Avatar sx={{ width: "2.7rem", height: "2.7rem", backgroundColor: theme.palette.primary.main }}>
                            <PersonIcon fontSize="large" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primaryTypographyProps={{ fontSize: theme.typography.body1.fontSize }}
                        secondaryTypographyProps={{ fontSize: theme.typography.body1.fontSize }}
                        primary="Firstname Lastname"
                        secondary="(+61) 123 456 789"
                    />
                </ListItem >
            </List>

            <ButtonPrimary onClick={addCarer}
                startIcon={<PersonAddIcon />}>
                Add Carer
            </ButtonPrimary>
        </>
    )
}

export default CareTeamList