import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useGlobalContext } from "../utils/globalUtils";

const ProtectedRoute = () => {
    const { store, dispatch } = useGlobalContext();

    // Check the authentication cookie when attempting to access protected routes.
    useEffect(() => {
        if (store.isAuth === false) {
            dispatch({
                type: "logout",
                data: document.cookie.includes("authenticated=true")
            });
        }
    }, [dispatch, store.isAuth]);

    return store.isAuth ? (
        <Outlet />
    ) : <Navigate to="/" replace />
}

export default ProtectedRoute