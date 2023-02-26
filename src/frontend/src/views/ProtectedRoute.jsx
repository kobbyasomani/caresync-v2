import { useCallback, useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useGlobalState } from "../utils/globalStateContext";
import baseURL from "../utils/baseUrl";

const ProtectedRoute = () => {
    const { store, dispatch } = useGlobalState();
    const navigate = useNavigate();

    /**
     * Authenticates the user when attempting to access protected routes.
     */
    const authUser = useCallback(async () => {
        // Authenticate with back-end server via request cookie
        // console.log(`Authenticating user...`);
        let isAuth = false;
        const response = await fetch(`${baseURL}/user/auth`, {
            credentials: "include",
        });
        isAuth = response.status === 200;
        // console.log(`user authentication: ${isAuth ? "success!" : "unauthorised"}`);

        // Update authentication status in store if it has changed
        if (isAuth !== store.isAuth) {
            dispatch({
                type: "setIsAuth",
                data: isAuth
            });
        };

        // If user does not pass server-side auth, log them out on client side
        if (isAuth === false) {
            dispatch({
                type: "resetStore"
            });
            navigate("/");
        }
    }, [dispatch, store.isAuth, navigate,]);

    // useEffect(() => {
    //     authUser();
    // }, [authUser]);

    return store.isAuth ? (
        <>
            <p style={{
                color: "red",
                // position: "absolute",
                margin: "0",
                padding: "0",
            }}><small>&lt;ProtectedRoute &#92;&gt;</small></p>
            <Outlet />
        </>
    ) : <Navigate to="/" replace />
}

export default ProtectedRoute