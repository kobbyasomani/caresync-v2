import {
    useRouteError,
    Link
} from "react-router-dom";

export default function Error() {
    const error = useRouteError();
    return (
        <>
            <h1>{error.statusText}</h1>
            <p>{error.message}</p>
            <Link
                to="/">
                Return Home
            </Link>
        </>
    )
}