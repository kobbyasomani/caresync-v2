import {
    NavLink,
    Outlet,
} from "react-router-dom";

export default function Root() {
    return (
        <>
            <nav id="nav-main">
                <ul>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/about">About</NavLink></li>
                    <li><NavLink to="/help">Help</NavLink></li>
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