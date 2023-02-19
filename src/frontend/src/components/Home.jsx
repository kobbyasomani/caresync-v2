import { useState } from "react";

export default function Home() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        errors: []
    });

    /**
     * Handle controlled form input.
     */
    function handleInput(event) {
        setForm(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.value,
                errors: []
            }
        });
    }

    /**
     * Validate and submit the login form.
     */
    function handleLogin(event) {
        event.preventDefault();
        // Make sure fields are not empty
        ["email", "password"].forEach(fieldValue => {
            if (!form[fieldValue]) {
                setForm(prev => {
                    return {
                        ...prev,
                        errors: [`${fieldValue} cannot be blank.\n`]
                    }
                });
            }
        });
        if (form.errors) return;
        // If there are no errors submit the form
    }

    return (
        <>
            <h1>CareSync</h1>
            <h2>Easy care work scheduling and shift notes.</h2>
            <section>
                <form onSubmit={handleLogin}>
                    <fieldset>
                        <legend>Sign in</legend>
                        <label>Email address
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="your@provider.com"
                                required
                                value={form.email}
                                onChange={handleInput} />
                        </label>
                        <label>Password
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="**********"
                                required
                                value={form.password}
                                onChange={handleInput} />
                        </label>
                        <button>
                            Log in
                        </button>
                    </fieldset>
                </form>
                <div id="form-error">{form.errors}</div>
            </section>
        </>
    )
}