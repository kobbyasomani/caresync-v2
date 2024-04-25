import { Typography, Container, Box, Stack, useTheme, useMediaQuery } from "@mui/material"

export default function About() {
    const theme = useTheme();
    const xsScreen = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Stack gap={4}>
                <Box>
                    <Typography variant="h1" sx={{ fontSize: xsScreen ? theme.typography.h2 : theme.typography.h1 }}>
                        About CareSync
                    </Typography>
                    <Typography variant="h2" sx={{ fontSize: xsScreen ? theme.typography.h4 : theme.typography.h3 }}>
                        Your care calendar and shift notes companion.
                    </Typography>
                    <Typography variant="body1" sx={{ maxWidth: "70ch" }}>
                        CareSync allows small, self-managed teams of personal carers and support workers
                        to easily create and edit shift notes, incident reports, and handover information,
                        as well as providing a calendar system to help organise carers.
                    </Typography>
                </Box>
                <Box id="quick-start-guide">
                    <Typography variant="h2" sx={{ fontSize: xsScreen ? theme.typography.h3 : theme.typography.h2 }}>
                        Quick Start Guide
                    </Typography>
                </Box>
            </Stack>
        </Container >
    );
}