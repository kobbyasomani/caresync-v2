import {
    NavLink,
    Outlet,
} from "react-router-dom";
import { useGlobalState } from "../utils/globalStateContext";

export default function Root() {
    const { store, dispatch } = useGlobalState();

    function handleLogout() {
        dispatch({
            type: "setUser",
            data: null
        });
    }

    return (
        <>
            <nav id="nav-main">
                <ul>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/about">About</NavLink></li>
                    <li><NavLink to="/help">Help</NavLink></li>
                    {store.user ?
                        <li><button onClick={handleLogout}>Log out</button></li>
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