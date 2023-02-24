import { useMemo } from "react";
import { useGlobalState } from "../utils/globalStateContext";
import { Outlet, Link } from "react-router-dom";
import Form from "./Form";
import { useHandleForm } from "../utils/formUtils";

export default function Login() {
    // console.log("rendering Home");

    // Get the global state and set form state
    const { store, dispatch } = useGlobalState();

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
    const [form, setForm] = useHandleForm(initialState);

    const setUser = () => {
        // console.log(`setting user ${form.inputs.email}...`)
        dispatch({
            type: "login",
            data: form.inputs.email
        });
    }

    return store.isAuth ? (
        <Outlet />
    ) : (
        <>
            <h1>CareSync</h1>
            <h2>Easy care work scheduling and shift notes.</h2>
            <div>
                <Form
                    form={form}
                    setForm={setForm}
                    legend="Sign in"
                    submitButtonText="Log in"
                    postURL="/user/login"
                    callback={setUser}
                >
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
            </div>
            <div>
                <h2 style={{ textAlign: "center" }}>No account?</h2>
                <Link to="/register">
                    <button className="button-action">
                        Sign up
                    </button>
                </Link>
            </div>
        </>
    );
}