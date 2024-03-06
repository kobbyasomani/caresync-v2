import { useCallback, React } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../utils/globalUtils";
import IconSmall from "../logo/IconSmall";

import {
    AppBar,
    Toolbar,
    Button,
    Container, Box,
    Typography, Stack,
    Tooltip
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const NavBar = () => {
    const { store, dispatch } = useGlobalContext();
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        dispatch({
            type: "logout",
        });
        navigate("/");
        window.location.reload();
    }, [dispatch, navigate]);

    const navItems = [
        {
            name: "Home",
            to: store.isAuth && store.selectedClient ? "/calendar"
                : store.isAuth && !store.selectedClient ? "/"
                    : "/"
        },
        {
            name: "About",
            to: "/about"
        }
    ]

    return (
        <AppBar id="nav-main" position="static">
            <Container>
                <Toolbar>
                    <Button component={RouterLink}
                        to={store.isAuth && store.selectedClient ? "/calendar"
                            : store.isAuth && !store.selectedClient ? "/"
                                : "/"}>
                        <IconSmall />
                    </Button>

                    {navItems.map((item, index) => (
                        <Button
                            component={RouterLink}
                            to={item.to}
                            key={index}
                            color="inherit">
                            {item.name}
                        </Button>
                    ))}
                    {store.isAuth ? (
                        <Stack direction="row" gap={2} sx={{ ml: "auto" }}>
                            <Stack direction="row" gap={0.5} sx={{ alignItems: "center" }}>
                                {/* // TODO: Add login credential editing modal for easier re-access of demo accounts */}
                                <AccountCircleIcon />
                                <Typography>
                                    {store.user.firstName}
                                </Typography>
                            </Stack>
                            <Tooltip position="bottom" title="Log out" sx={{ display: { xs: "none", md: "flex" } }}>
                                <Button id="logout"
                                    startIcon={<LogoutIcon />}
                                    color="inherit"
                                    aria-label="log out"
                                    size="small"
                                    onClick={handleLogout}
                                >
                                    <Box sx={{ display: { xs: "none", md: "inline" } }}>
                                        Log out
                                    </Box>
                                </Button>
                            </Tooltip>

                        </Stack>
                    ) : (
                        null
                    )}
                </Toolbar>
            </Container>
        </AppBar >
    );
}

export default NavBar