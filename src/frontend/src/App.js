import React, { useState, useReducer, useEffect, useCallback } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { GlobalStateContext, globalReducer, emptyStore } from "./utils/globalUtils";
import { ModalContext, useModalReducer } from "./utils/modalUtils";
import { generateEncryptionKey, encryptSessionData, decryptSessionData } from "./utils/apiUtils";
import Root from "./views/Root";
import Home from "./views/Home";
import ProtectedRoute from "./views/ProtectedRoute";
import Register from "./views/Register";
import Verification from "./views/Verification";
import About from "./views/About";
import Help from "./views/Help";
import Error from "./views/Error";
import SelectClient from "./views/SelectClient";
import Calendar from "./views/Calendar";
import MyAccount from "./components/dialogs/MyAccount";

import ShiftDetailsDrawer from "./components/shift-details/ShiftDetailsDrawer";
import ShiftOverview from "./components/shift-details/ShiftOverview";
import CoordinatorNotes from "./components/shift-details/CoordinatorNotes";
import PrevShiftHandover from "./components/shift-details/PrevShiftHandover";
import ShiftNotes from "./components/shift-details/ShiftNotes";
import IncidentReports from "./components/shift-details/IncidentReports";
import CreateIncidentReport from "./components/shift-details/CreateIncidentReport";
import IncidentReportDetails from "./components/shift-details/IncidentReportDetails";
import HandoverNotes from "./components/shift-details/HandoverNotes";

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
                element: <>
                  <MyAccount />
                  <SelectClient />
                </>
              },
              {
                path: "/calendar",
                element: <Calendar />,
                children: [
                  {
                    path: "/calendar/shift-details",
                    element: <ShiftDetailsDrawer />,
                    children: [
                      {
                        path: "/calendar/shift-details",
                        element: <ShiftOverview />,
                      },
                      {
                        path: "/calendar/shift-details/coordinator-notes",
                        element: <CoordinatorNotes />,
                      },
                      {
                        path: "/calendar/shift-details/prev-shift-handover",
                        element: <PrevShiftHandover />
                      },
                      {
                        path: "/calendar/shift-details/shift-notes",
                        element: <ShiftNotes />
                      },
                      {
                        path: "/calendar/shift-details/incident-reports",
                        element: <IncidentReports />,
                      },
                      {
                        path: "/calendar/shift-details/incident-reports/:incident_id",
                        element: <IncidentReportDetails />
                      },
                      {
                        path: "/calendar/shift-details/incident-reports/create-incident-report",
                        element: <CreateIncidentReport />
                      },
                      {
                        path: "/calendar/shift-details/handover-notes",
                        element: <HandoverNotes />
                      },
                    ]
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
        path: "/addCarer/:token",
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
  Refactor these hooks in future to set and fetch
  authenticated session data from backend server */

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
          // isAuth: localStorage.isAuth,
          // user: localStorage.user,
          // selectedClient: localStorage.selectedClient,
          // shifts: localStorage.shifts,
          // featuredShift: localStorage.featuredShift,
          // previousShifts: localStorage.previousShifts,
          // selectedShift: localStorage.selectedShift,
          // refreshCalendar: localStorage.refreshCalendar
        };
        // Set global state to defaults if not in localStorage
      } else {
        return emptyStore;
      }
    }, []);

    const [store, dispatch] = useReducer(globalReducer, initialState());
    const [encryptionKey, setEncryptionKey] = useState(null);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Generate and set the encryption key in state on initial load
    useEffect(() => {
      const generateKey = async () => {
        const key = await generateEncryptionKey();
        setEncryptionKey(key);
      }
      generateKey();
    }, []);

    // Set required global state values in localStorage any time their state changes
    // TODO: Create database sessions instead of using localStorage
    useEffect(() => {
      // console.log("updating localStorage from store...");
      window.localStorage.setItem("careSync", JSON.stringify({
        ...store,
      }));

      // TODO: Post the encrypted session data to the server
      // const testSessionData = async () => {
      //   if (encryptionKey) {
      //     const encryptedSessionData = await encryptSessionData(store, encryptionKey, iv)
      //     console.log(encryptedSessionData);
      //     console.log(await decryptSessionData(encryptedSessionData, encryptionKey, iv));
      //   }
      // }
      // testSessionData();
    }, [store, encryptionKey, iv]);

    return (
      <GlobalStateContext.Provider value={{ store, dispatch, crypto: { key: encryptionKey, iv } }}>
        {children}
      </GlobalStateContext.Provider>
    );
  }

  // Modal and drawer state handler
  const ModalProvider = ({ children }) => {
    const [modalStore, modalDispatch] = useModalReducer({
      modalIsOpen: false,
      drawerIsOpen: false,
      confirmationIsOpen: false,
      id: "",
      activeModal: {
        title: "This is an empty modal",
        text: `You can use the modalDispatch function to set the active modal 
'title' and 'text' or pass them to the modal as props. The modal content in 
the Calendar view will be the component returned by the URL path (/calendar/<path>).`
      }
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