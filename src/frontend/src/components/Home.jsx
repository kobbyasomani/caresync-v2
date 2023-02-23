import { useMemo } from "react";
import { useGlobalState } from "../utils/globalStateContext";
import { Outlet } from "react-router-dom";
import Form from "./Form";

export default function Login() {
    // console.log("rendering Home");

    // Get the global state
    const { store } = useGlobalState();

    // Set the initial form state
    const initialState = useMemo(() => {
        return {
            inputs: {
                email: "",
                password: "",
            },
            errors: []
        }
    }, [])

    return store.isAuth ? (
        <Outlet />
    ) : (
        <>
            <h1>CareSync</h1>
            <h2>Easy care work scheduling and shift notes.</h2>
            <section>
                <Form initialState={initialState}
                    legend="Sign in"
                    submitButtonText="Log in"
                    postURL="/user/login">
                    <label htmlFor="email">Email address</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="your@provider.com"
                        required />
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="**********"
                        required />
                </Form>
            </section>
            <section>
                <h2 style={{ textAlign: "center" }}>No account?</h2>
                <button className="button-action">
                    Sign up
                </button>
            </section>
        </>
    )
}