import { useCallback, React } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import IconSmall from "../logo/IconSmall";

import {
    AppBar, Toolbar,
    Button, IconButton,
    Container, Stack,
    Typography, Tooltip,
    useMediaQuery, useTheme
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const NavBar = () => {
    const { store, dispatch } = useGlobalContext();
    const navigate = useNavigate();
    const theme = useTheme();
    const xsScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
                        <Stack direction="row" gap={1} sx={{ ml: "auto" }}>
                            {/* // TODO: Add login credential editing modal for easier re-access of demo accounts */}
                            <Tooltip title="My account">
                                {xsScreen ? (
                                    <IconButton id="my-account"
                                        color="inherit"
                                        aria-label="my account"
                                    >
                                        <AccountCircleIcon />
                                    </IconButton>
                                ) : (
                                    <Button id="my-account"
                                        startIcon={<AccountCircleIcon />}
                                        color="inherit"
                                        aria-label="my account"
                                    >
                                        <Typography textTransform="capitalize">
                                            {store.user.firstName}
                                        </Typography>
                                    </Button>
                                )}
                            </Tooltip>
                            <Tooltip position="bottom" title="Log out">
                                {xsScreen ? (
                                    <IconButton id="log-out"
                                        color="inherit"
                                        aria-label="log out"
                                        onClick={handleLogout}
                                    >
                                        <LogoutIcon />
                                    </IconButton>
                                ) : (
                                    <Button id="log-out"
                                        startIcon={<LogoutIcon />}
                                        color="inherit"
                                        aria-label="log out"
                                        onClick={handleLogout}
                                    >
                                        <Typography textTransform="capitalize">
                                            Log out
                                        </Typography>
                                    </Button>
                                )}
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