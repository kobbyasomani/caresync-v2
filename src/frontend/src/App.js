import React from "react";
import { GlobalStateContext, globalReducer, emptyStore } from "./utils/globalUtils";
import { ModalContext, useModalReducer } from "./utils/modalUtils";
import { useReducer, useEffect, useCallback } from "react"

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
import SelectShiftByDate from "./components/dialogs/SelectShiftByDate";
import AddShiftForm from "./components/forms/AddShiftForm";
import EditShiftForm from "./components/forms/EditShiftForm";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { Theme as theme } from "./styles/Theme";

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
                element: <Calendar />,
                children: [
                  {
                    path: "/calendar/select-shift-by-date",
                    element: <SelectShiftByDate />
                  },
                  {
                    path: "/calendar/add-shift",
                    element: <AddShiftForm />
                  },
                  {
                    path: "/calendar/edit-shift",
                    element: <EditShiftForm />
                  },
                ]
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

  // Global state handler
  const GlobalProvider = ({ children }) => {
    const initialState = useCallback(() => {
      // Get global state values from localStorage on load if available
      const localStorage = window.localStorage.careSync ?
        JSON.parse(window.localStorage.getItem("careSync")) : null;
      // Set the global state values from localStorage
      if (localStorage) {
        return {
          ...localStorage,
          isAuth: localStorage.isAuth,
          user: localStorage.user,
          selectedPatient: localStorage.selectedPatient,
          shifts: localStorage.shifts,
          featuredShift: localStorage.featuredShift,
          previousShifts: localStorage.previousShifts,
          selectedShift: localStorage.selectedShift,
        };
        // Set global state to defaults if not in localStorage
      } else {
        return emptyStore;
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
        {children}
      </GlobalStateContext.Provider>
    );
  }

  // Modal and drawer state handler
  const ModalProvider = ({ children }) => {
    const [modalStore, modalDispatch] = useModalReducer({
      modalIsOpen: false,
      drawerIsOpen: false,
      activeModal: {
        title: "This is an empty modal",
        text: `You can use the modalDispatch function to set the active modal 
'title' and 'text' or pass them to the modal as props. The modal content in 
the Calendar view will be the component returned by the URL path (/calendar/<path>).`
      },
      prevDrawer: [],
      activeDrawer: ""
    });
    return (
      <ModalContext.Provider value={{ modalStore, modalDispatch }}>
        {children}
      </ModalContext.Provider>
    );
  }

  return (
    <GlobalProvider>
      <ModalProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </ModalProvider>
    </GlobalProvider >
  );
}

export default App;