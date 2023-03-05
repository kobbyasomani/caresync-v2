import {
    ListItem, ListItemAvatar, ListItemText,
    Avatar, IconButton, Tooltip, useTheme
} from "@mui/material"
import PersonIcon from '@mui/icons-material/Person';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const Carer = ({ carer }) => {
    const theme = useTheme();

    return (
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
                primary={`${carer.firstName} ${carer.lastName}`}
                secondary="(+61) 123 456 789"
            />
        </ListItem >
    )
}

export default Carer