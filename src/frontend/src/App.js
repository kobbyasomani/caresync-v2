import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Root from "./components/Root";
import Home from "./components/Home";
import About from "./components/About";
import Help from "./components/Help";
import Error from "./components/Error";
import { GlobalStateContext } from "./utils/globalStateContext";
import { useReducer } from "react"
import globalReducer from "./utils/globalReducer";

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
  },
]);

function App() {
  const initialState = {
    user: null,
  }

  const [store, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalStateContext.Provider value={{ store, dispatch }}>
      <RouterProvider router={router} />
    </GlobalStateContext.Provider>
  );
}

export default App;