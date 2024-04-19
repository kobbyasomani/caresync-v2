import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useGlobalContext } from "../utils/globalUtils";

const ProtectedRoute = () => {
    const { store, dispatch } = useGlobalContext();
    const { handleLogout } = store.functions;

    // Check if the user is authenticated when attempting to access protected routes.
    useEffect(() => {
        // TODO: Ping the server to check for authentication instead of relying on client cookie.
        const auth = document.cookie.includes("authenticated=true");
        dispatch({
            type: "setIsAuth",
            data: auth
        });
        if (!auth) {
            handleLogout();
        }
    }, [dispatch, handleLogout]);

    return store.isAuth ? <Outlet />
        : null
}

export default ProtectedRoute