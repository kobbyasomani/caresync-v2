import { useCallback } from "react";
import { useModalContext } from "../utils/modalUtils";

import {
    Card, CardContent, CardActionArea,
    Typography, Box, IconButton
} from "@mui/material"
import EventNoteIcon from '@mui/icons-material/EventNote';
import ForumIcon from '@mui/icons-material/Forum';
import DescriptionIcon from '@mui/icons-material/Description';
import ReportIcon from '@mui/icons-material/Report';

const Shift = ({ featured, shift }) => {
    // Set local loading state

    // Get modal dispatch method to toggle modal from shift card
    const { modalDispatch } = useModalContext();

    // Open the shift details drawer and close the modal
    const openShift = useCallback(() => {
        modalDispatch({
            type: "open",
            data: "drawer"
        });
        modalDispatch({
            type: "close",
            data: "modal"
        });
    }, [modalDispatch]);

    return (
        <Card variant="outlined" className={featured ? "shift featured" : "shift"}
            sx={{ display: "flex", alignItems: "center" }}>
            <CardActionArea onClick={openShift}>
                <CardContent sx={{
                    display: "grid",
                    gridTemplate: "repeat(2, 1fr) / auto 1fr",
                    alignItems: "center"
                }}>
                    <Box sx={{ display: "flex", gridArea: "1 / 1 / 2 / 2" }}>
                        <EventNoteIcon sx={{ mr: "0.5rem" }} />
                        <Typography variant="body1" className="shift-date">
                            {shift ? new Date(shift.shiftStartTime).toLocaleDateString() : "Could not load shift time"}
                        </Typography>
                    </Box>
                    <Box sx={{ gridArea: "2 / 1 / 3 / 2" }}>
                        <Typography variant="body1" className="shift-carer">Carer: Firstname LastName</Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
            {/* Show shift buttons only on larger screen sizes */}
            <Box className="shift-buttons" sx={{ flexShrink: 0 }}>
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