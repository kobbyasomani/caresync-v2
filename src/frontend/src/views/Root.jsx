import { Outlet } from "react-router-dom";
import NavBar from "../components/root/NavBar";
import Footer from "../components/root/Footer";
import { Box, Container } from "@mui/material";

export default function Root() {
    return (
        <>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                backgroundColor: "#fffefc"
            }}>
                <NavBar />
                <Container component="main">
                    <Outlet />
                </Container>
                <Footer />
            </Box>
        </>
    );
}