import { useCallback, React } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../utils/globalUtils";
import LogoSmall from "../logo/LogoSmall";

import {
    AppBar,
    Toolbar,
    Button,
    Container,
    Box, useTheme
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';


const NavBar = () => {
    const { store, dispatch } = useGlobalContext();
    const navigate = useNavigate();
    const theme = useTheme();

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
            to: store.isAuth && store.selectedPatient ? "/calendar"
                : store.isAuth && !store.selectedPatient ? "/"
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
                        to={store.isAuth && store.selectedPatient ? "/calendar"
                            : store.isAuth && !store.selectedPatient ? "/"
                                : "/"}>
                        <LogoSmall />
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
                        <Button id="logout"
                            startIcon={<LogoutIcon />}
                            color="inherit"
                            aria-label="log out"
                            size="small"
                            onClick={handleLogout}
                            sx={{ ml: "auto" }}>
                            <Box sx={{ [theme.breakpoints.down("sm")]: { display: "none" } }}>
                                Log out
                            </Box>
                        </Button>
                    ) : (
                        null
                    )
                    }
                </Toolbar>
            </Container>
        </AppBar >
    );
}

export default NavBar