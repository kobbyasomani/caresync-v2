import { useCallback } from "react";
import { useGlobalContext } from "../utils/globalUtils";
import { useModalContext } from "../utils/modalUtils";
import Confirmation from "./dialogs/Confirmation";
// import { getCarers } from "../utils/apiUtils";
import axios from "axios";
import { getAllShifts } from "../utils/apiUtils";

import {
    ListItem, ListItemAvatar, ListItemText,
    Avatar, IconButton, Tooltip, useTheme
} from "@mui/material"
import PersonIcon from '@mui/icons-material/Person';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const Carer = ({ carer }) => {
    const theme = useTheme();
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();

    const confirmRemoveCarer = useCallback(() => {
        modalDispatch({
            type: "open",
            data: "confirmation"
        });
    }, [modalDispatch]);

    const removeCarer = useCallback(() => {
        // console.log("removing carer...")
        axios.delete(`carer/remove/${store.selectedPatient._id}/${carer._id}`)
            .then(() => {
                getAllShifts(store.selectedPatient._id)
                    .then(shifts => {
                        dispatch({
                            type: "setShifts",
                            data: shifts
                        });
                    });
            });
    }, [carer._id, store.selectedPatient, dispatch]);

    return (
        <>
            <ListItem sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: `${theme.shape.borderRadius}px`,
                p: "1rem"
            }}>
                <Tooltip title="Remove carer" placement="left">
                    <IconButton onClick={confirmRemoveCarer}
                        sx={{ position: "absolute", top: "0.25rem", right: "0.25rem" }}>
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
                    primary={`${carer.firstName} ${carer.lastName}`}
                    secondary="(+61) 123 456 789"
                />
            </ListItem >

            <Confirmation title="Remove Carer"
                text={`Are you sure you want to remove this carer?`}
                callback={removeCarer}
            />
        </>
    )
}

export default Carer