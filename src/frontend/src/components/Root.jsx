import {
    NavLink,
    Outlet,
    useNavigate,
} from "react-router-dom";
import { useGlobalState } from "../utils/globalStateContext";
import { useCallback } from "react";
import baseURL from "../utils/baseUrl";

export default function Root() {
    // console.log("rendering Root");

    const { store, dispatch } = useGlobalState();
    const navigate = useNavigate();

    const handleLogout = useCallback(async () => {
        // console.log("logging out...");

        fetch(`${baseURL}/user/auth?logout=true`, {
            credentials: "include"
        });
        dispatch({
            type: "logout",
        });
        navigate("/");
    }, [dispatch, navigate]);

    return (
        <>
            <nav id="nav-main">
                <ul>
                    <li><NavLink
                        to={store.isAuth && store.selectedPatient ? "/calendar"
                            : "/"}>Home</NavLink></li>
                    <li><NavLink to="/about">About</NavLink></li>
                    <li><NavLink to="/help">Help</NavLink></li>
                    {store.isAuth ?
                        <li id="logout"><button onClick={handleLogout}>Log out</button></li>
                        : null
                    }
                </ul>
            </nav>
            <main>
                <Outlet />
            </main>
            <footer>
                <p>
                    &copy; 2023
                </p>
            </footer>
        </>
    );
}