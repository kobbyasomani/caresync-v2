export default function Home() {
    return (
        <>
            <h1>CareSync</h1>
            <h2>Easy care work scheduling and shift notes.</h2>
            <section>
                <form>
                    <fieldset>
                        <legend>Sign in</legend>
                        <label>Email address
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="your@provider.com" />
                        </label>
                        <label>Password
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="**********" />
                        </label>
                        <button>Log in</button>
                    </fieldset>
                </form>
            </section>

        </>
    )
}