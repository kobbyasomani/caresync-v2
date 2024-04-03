import React, { useState, useReducer, useEffect, useCallback } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { GlobalStateContext, globalReducer, emptyStore } from "./utils/globalUtils";
import { ModalContext, useModalReducer } from "./utils/modalUtils";
import {
  generateEncryptionKey, encryptSessionData, decryptSessionData,
  readSession, uploadSession
} from "./utils/apiUtils";
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
                path: "/clients",
                element: <>
                  <MyAccount />
                  <SelectClient readSession={readSession} />
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
  // Global state handler
  const GlobalProvider = ({ children }) => {
    const [encryptionKey, setEncryptionKey] = useState(null);
    const [iv] = useState(new Uint8Array(process.env.REACT_APP_CRYPTO_IV.split(',').map(Number)).buffer);
    const [store, dispatch] = useReducer(globalReducer, emptyStore);

    /**
     * Attempts to read session data for the logged-in user from the server. If a session is found,
     * decrypts it, sets it in the global context store, and returns an `Object` with a `loaded` value
     * of `true`. If no session is found, the truened `Object` will have a `loaded` value of `false`.
     * @returns {Promise<Object>}
     */
    const loadSession = useCallback(() => {
      const earlyReturn = () => {
        dispatch({
          type: "setAppIsLoading",
          data: false
        });
        return Promise.resolve({ loaded: false });
      }
      if (!document.cookie.includes("authenticated=true")) {
        return earlyReturn();
      }
      const loadedSession = readSession().then(sessionData => {
        if (sessionData) {
          decryptSessionData(sessionData, encryptionKey, iv)
            .then(session => {
              dispatch({
                type: "updateStore",
                data: {
                  ...session,
                  appIsLoading: false
                }
              });
              return Promise.resolve({ loaded: true });
            });
        } else {
          return earlyReturn();
        }
      });
      return loadedSession;
    }, [encryptionKey, iv]);

    /**
     * Encrypt the current global context store state and post it to the server.
     */
    const saveSession = useCallback(() => {
      const encryptSession = async () => {
        const encryptedSession = await encryptSessionData(store, encryptionKey, iv);
        return encryptedSession;
      }
      encryptSession()
        .then(session => {
          return uploadSession(session);
        });
    }, [encryptionKey, iv, store]);

    useEffect(() => {
      const generateKey = async () => {
        const key = await generateEncryptionKey();
        setEncryptionKey(key);
      }
      if (!encryptionKey) {
        generateKey();
      }
    }, [encryptionKey]);

    useEffect(() => {
      if (!store.isAuth && encryptionKey) {
        loadSession();
      }
    }, [store.isAuth, encryptionKey, loadSession, dispatch]);

    useEffect(() => {
      if (store.isAuth && encryptionKey) {
        saveSession();
      }
    }, [store, encryptionKey, saveSession, store.isAuth]);

    return (
      <GlobalStateContext.Provider value={{
        store, dispatch,
        crypto: { key: encryptionKey, iv, saveSession, loadSession },
      }}>
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

export default App