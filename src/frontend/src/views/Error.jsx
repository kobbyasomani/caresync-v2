import { React, useEffect } from 'react';
import { useRouteError, Link } from "react-router-dom";

import { useModalContext } from '../utils/modalUtils';
import NavBar from "../components/root/NavBar";
import Footer from "../components/root/Footer";
import { ButtonPrimary } from "../components/root/Buttons";

import { Typography, Box, Container } from "@mui/material"

export default function Error() {
    const error = useRouteError();
    const { modalDispatch } = useModalContext();

    /* Close open modal/drawer if user hits the error route to
prevent them being already-open when navigating to another view */
    useEffect(() => {
        modalDispatch({
            type: "closeAllModals",
        });
    }, [modalDispatch]);

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
        }}>
            <NavBar />
            <Container component="main"
                maxWidth="md"
                sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
                <Typography variant="h1">
                    {process.env.NODE_ENV === "production" ? "Error" : error.statusText}
                </Typography>
                <Typography variant="h2">
                    {process.env.NODE_ENV === "production" ? "We've run into an unexpected problem." : error.message}
                </Typography>
                <Typography variant="body1">
                    Oops! It looks like CareSync encounterd a problem while trying to perform an action.
                    <br />Try refreshing your browser window, or return home using the button below to see if the issue resolves.
                </Typography>
                <Link to="/" className="button-link">
                    <ButtonPrimary>
                        Return Home
                    </ButtonPrimary>
                </Link>
            </Container>
            <Footer />
        </Box>
    )
}