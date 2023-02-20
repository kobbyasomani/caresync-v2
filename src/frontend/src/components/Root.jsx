import {
    NavLink,
    Outlet,
    useNavigate
} from "react-router-dom";
import { useGlobalState } from "../utils/globalStateContext";

export default function Root() {
    const { store, dispatch } = useGlobalState();
    const navigate = useNavigate();

    function handleLogout() {
        dispatch({
            type: "resetStore",
            data: null
        });
        navigate("/");
    }

    return (
        <>
            <nav id="nav-main">
                <ul>
                    <li><NavLink
                        to={store.patients && !store.selectedPatient ? "/select-patient"
                            : store.selectedPatient ? "/calendar"
                                : "/"}>Home</NavLink></li>
                    <li><NavLink to="/about">About</NavLink></li>
                    <li><NavLink to="/help">Help</NavLink></li>
                    {store.user ?
                        <li><button id="logout" onClick={handleLogout}>Log out</button></li>
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