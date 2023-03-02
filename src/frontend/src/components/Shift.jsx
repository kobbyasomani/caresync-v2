import { useCallback } from "react";
import { useModalContext } from "../utils/modalUtils";
import { useGlobalContext } from "../utils/globalUtils";

import {
    Card, CardContent, CardActionArea,
    Typography, Box, IconButton, useTheme
} from "@mui/material"
import EventNoteIcon from '@mui/icons-material/EventNote';
import ForumIcon from '@mui/icons-material/Forum';
import DescriptionIcon from '@mui/icons-material/Description';
import ReportIcon from '@mui/icons-material/Report';

const Shift = ({ featured, shift }) => {
    const { dispatch } = useGlobalContext();
    // Get modal dispatch method to toggle modal from shift card
    const { modalDispatch } = useModalContext();

    const theme = useTheme();

    // Open the shift details drawer and close the modal
    const openShift = useCallback(() => {
        dispatch({
            type: "setSelectedShift",
            data: shift
        });
        modalDispatch({
            type: "close",
            data: "modal"
        });
        modalDispatch({
            type: "open",
            data: "drawer"
        });
    }, [modalDispatch, dispatch, shift]);

    return (
        <Card variant="outlined" className={featured ? "shift featured" : "shift"}
            sx={{ display: "flex", alignItems: "center" }}>
            <CardActionArea onClick={openShift}>
                <CardContent sx={{
                    display: "grid",
                    gridTemplate: "repeat(2, 1fr) / auto 1fr",
                    alignItems: "center"
                }}>
                    <Box sx={{ display: "flex", gridArea: "1 / 1 / 2 / 2", [theme.breakpoints.down("sm")]: { gridArea: "1 / 1 / 2 / 3" }}}>
                        <EventNoteIcon sx={{ mr: "0.5rem" }} />
                        <Typography variant="body1" className="shift-date">
                            {shift ? new Date(shift.shiftStartTime)
                                .toLocaleString("en-AU", { dateStyle: "long", timeStyle: "short" }) : "Could not load shift time"}
                        </Typography>
                    </Box>
                    <Box sx={{ gridArea: "2 / 1 / 3 / 2", [theme.breakpoints.down("sm")]: { gridArea: "2 / 1 / 3 / 3" } }}>
                        <Typography variant="body1" className="shift-carer">
                            Carer: {shift.carer.firstName} {shift.carer.lastName}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
            {/* Show shift buttons only on larger screen sizes */}
            <Box className="shift-buttons" sx={{ flexShrink: 0, [theme.breakpoints.down("sm")]: { display: "none" } }}>
                <IconButton className="shift-button-handover">
                    <ForumIcon />
                </IconButton>
                <IconButton className="shift-button-notes">
                    <DescriptionIcon />
                </IconButton>
                <IconButton className="shift-button-incidents">
                    <ReportIcon />
                </IconButton>
            </Box>
        </Card>
    );
}

export default Shift