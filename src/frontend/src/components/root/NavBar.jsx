import { useCallback, React } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { logoutUser } from "../../utils/apiUtils";
import IconSmall from "../logo/IconSmall";

import {
    AppBar, Toolbar,
    Button, IconButton,
    Container, Stack,
    Typography, Tooltip,
    useMediaQuery, useTheme
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

const NavBar = () => {
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const navigate = useNavigate();
    const theme = useTheme();
    const smScreen = useMediaQuery(theme.breakpoints.down("md"));
    const xsScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const handleOpenMyAccount = useCallback(() => {
        modalDispatch({
            type: "open",
            data: "modal",
            id: "my-account"
        });
    }, [modalDispatch]);

    const handleLogout = useCallback(() => {
        dispatch({
            type: "setAppIsLoading",
            data: true
        });
        logoutUser().then(() => {
            dispatch({
                type: "logout",
            });
            navigate("/");
        });
    }, [dispatch, navigate]);

    const navItems = [
        {
            name: store.isAuth ? "Clients" : "Home",
            to: store.isAuth ? "/clients" : "/",
            icon: store.isAuth ? <AssignmentIndRoundedIcon /> : <HomeRoundedIcon />
        },
        {
            name: store.isAuth && (store.selectedClient?._id || store.prevSelectedClient?._id) ? "Calendar" : "",
            to: store.isAuth ? "/calendar" : "/",
            icon: <CalendarMonthRoundedIcon />
        },
        {
            name: "About",
            to: "/about",
            icon: <HelpRoundedIcon />
        }
    ]

    return (
        <AppBar id="nav-main" position="static">
            <Container>
                <Toolbar>
                    <Button component={RouterLink} sx={{ mr: 2 }}
                        to={store.isAuth && store.selectedClient?._id ? "/calendar"
                            : store.isAuth && !store.selectedClient?._id ? "/clients"
                                : "/"} startIcon={<IconSmall />}>
                        <Typography variant="h5" component="h1"
                            sx={{
                                color: "white",
                                textTransform: "none",
                                position: { xs: "absolute", md: "static" },
                                left: { xs: "-300%", md: "initial" }
                            }}>
                            CareSync
                        </Typography>
                    </Button>
                    {navItems.filter(item => item.name && item.to).map((item, index) =>
                        xsScreen ?
                            <IconButton component={RouterLink}
                                to={item.to}
                                key={index}
                                color="inherit"
                            >
                                {item.icon}
                            </IconButton>
                            : <Button
                                component={RouterLink}
                                to={item.to}
                                key={index}
                                color="inherit"
                                startIcon={item.icon}
                                sx={{ textTransform: 'capitalize', mr: 1 }}
                            >
                                <Typography>
                                    {xsScreen ? null : item.name}
                                </Typography>
                            </Button>
                    )}
                    {store.isAuth ? (
                        <Stack direction="row" gap={xsScreen ? 0 : 1} sx={{ ml: "auto" }}>
                            <Tooltip title="My Account">
                                {smScreen ? (
                                    <IconButton id="my-account"
                                        color="inherit"
                                        aria-label="my account"
                                        onClick={handleOpenMyAccount}
                                    >
                                        <AccountCircleRoundedIcon />
                                    </IconButton>
                                ) : (
                                    <Button id="my-account"
                                        startIcon={<AccountCircleRoundedIcon />}
                                        color="inherit"
                                        aria-label="my account"
                                        onClick={handleOpenMyAccount}
                                    >
                                        <Typography textTransform="capitalize">
                                            {store.user.firstName}
                                        </Typography>
                                    </Button>
                                )}
                            </Tooltip>
                            <Tooltip position="bottom" title="Log out">
                                {smScreen ? (
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