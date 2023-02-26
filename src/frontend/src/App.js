import { GlobalStateContext } from "./utils/globalStateContext";
import { useReducer, useEffect, useCallback } from "react"
import globalReducer from "./utils/globalReducer";

import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Root from "./views/Root";
import Home from "./views/Home";
import ProtectedRoute from "./views/ProtectedRoute";
import Register from "./views/Register";
import Verification from "./views/Verification";
import About from "./views/About";
import Help from "./views/Help";
import Error from "./views/Error";
import SelectPatient from "./views/SelectPatient";
import Calendar from "./views/Calendar";

import { CssBaseline, ThemeProvider } from "@mui/material";
import DefaultTheme from "./styles/DefaultTheme";
const theme = DefaultTheme;

// Create the router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
        children: [
          {
            element: <ProtectedRoute />,
            children: [
              {
                path: "/",
                element: <SelectPatient />
              },
              {
                path: "/calendar",
                element: <Calendar />
              }
            ]
          }
        ]
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/emailVerification/:token",
        element: <Verification />,
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
]);

function App() {
  /* FOR SECURITY: 
  Refactor these hooks to fetch authenticated
  session data from backend-server */

  const initialState = useCallback(() => {
    // Get global state values from localStorage on load if available
    const localStorage = window.localStorage.careSync ?
      JSON.parse(window.localStorage.getItem("careSync")) : null;
    // Set the global state values from localStorage
    if (localStorage) {
      return {
        isAuth: localStorage.isAuth,
        user: localStorage.user,
        selectedPatient: localStorage.selectedPatient
      };
      // Set global state to defaults if not in localStorage
    } else {
      return {
        isAuth: false,
        user: "",
        selectedPatient: ""
      };
    }
  }, []);

  const [store, dispatch] = useReducer(globalReducer, initialState());

  // Set required global state values in localStorage any time their state changes
  useEffect(() => {
    // console.log("updating localStorage from store...");
    window.localStorage.setItem("careSync", JSON.stringify({
      ...store,
    }));
  }, [store]);

  return (
    <GlobalStateContext.Provider value={{ store, dispatch }}>
      <ThemeProvider theme={DefaultTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </GlobalStateContext.Provider >
  );
}

export default App;