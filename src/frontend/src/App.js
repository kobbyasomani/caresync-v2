import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Root from "./components/Root";
import Home from "./components/Home";
import About from "./components/About";
import Help from "./components/Help";
import Error from "./components/Error";

// Create the router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/help",
        element: <Help />
      },
    ]
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
