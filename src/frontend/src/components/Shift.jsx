import React from "react";
import { styled } from "@mui/system";
import {
    Card, CardContent, CardActionArea,
    Typography, Box, IconButton
} from "@mui/material"
import EventNoteIcon from '@mui/icons-material/EventNote';
import ForumIcon from '@mui/icons-material/Forum';
import DescriptionIcon from '@mui/icons-material/Description';
import ReportIcon from '@mui/icons-material/Report';

const Shift = () => {
    return (
        <Card variant="outlined" className="shift" data-testid="card"
            sx={{ display: "flex", alignItems: "center" }}>
            <CardActionArea>
                <CardContent sx={{
                    display: "grid",
                    gridTemplate: "repeat(2, 1fr) / auto 1fr",
                    alignItems: "center"
                }}>
                    <Box sx={{ display: "flex", gridArea: "1 / 1 / 2 / 2" }}>
                        <EventNoteIcon sx={{ mr: "0.5rem" }} />
                        <Typography variant="body1" className="shift-date">DD/MM/YY | 00:00 – 00:00</Typography>
                    </Box>
                    <Box sx={{ gridArea: "2 / 1 / 3 / 2" }}>
                        <Typography variant="body1" className="shift-carer">Carer: Firstname LastName</Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
            {/* Show shift buttons only on larger screen sizes */}
            <Box className="shift-buttons" sx={{ flexShrink: 0 }}>
                <IconButton className="shift-button-handover" data-testid="handover">
                    <ForumIcon />
                </IconButton>
                <IconButton className="shift-button-notes" data-testid="notes">
                    <DescriptionIcon />
                </IconButton>
                <IconButton className="shift-button-incidents" data-testid="incidents">
                    <ReportIcon />
                </IconButton>
            </Box>
        </Card>
    );
}

export default Shift