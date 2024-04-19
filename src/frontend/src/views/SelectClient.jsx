import React, { useEffect, useState, useCallback } from "react";

import { useGlobalContext } from "../utils/globalUtils";
import { useModalContext } from "../utils/modalUtils";
import { getClientList } from "../utils/apiUtils";
import Client from "../components/Client";
import Modal from "../components/Modal";
import AddClientForm from "../components/forms/AddClientForm";
import { ButtonPrimary } from "../components/root/Buttons";
import Loader from "../components/logo/Loader";

import { Stack, Typography, Tabs, Tab, Box, Container, useMediaQuery } from "@mui/material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';

import { Theme as theme } from "../styles/Theme";

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

const SelectClient = () => {
    const { store, dispatch } = useGlobalContext();
    const { handleLogout } = store.functions;
    const { modalDispatch } = useModalContext();
    const [isLoading, setIsLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const xsScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const handleChangeTabs = useCallback((event, newValue) => {
        setTabValue(newValue);
    }, []);

    const handleAddClient = useCallback(() => {
        modalDispatch({
            type: "open",
            data: "modal",
            id: "add-client"
        });
    }, [modalDispatch]);

    useEffect(() => {
        if (!store.isAuth) {
            handleLogout();
        }
    }, [store.isAuth, handleLogout]);

    // Fetch the list of clients for the logged-in user
    useEffect(() => {
        getClientList().then(clients => {
            dispatch({
                type: "setClients",
                data: clients
            });
            setIsLoading(false);
        }).catch(error => {
            if (process.env.NODE_ENV !== "production") {
                console.error(error.message);
            }
        });
    }, [dispatch, setIsLoading]);

    useEffect(() => {
        if (store.selectedClient?._id) {
            dispatch({
                type: "updateStore",
                data: {
                    selectedClient: {},
                    prevSelectedClient: store.selectedClient
                }
            });
        }
    }, [dispatch, store.selectedClient]);

    return isLoading ? (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h1" sx={{ fontSize: xsScreen ? theme.typography.h2 : theme.typography.h1 }}>
                Hi, {store.user.firstName}</Typography>
            <Typography variant="h2" sx={{
                fontSize: xsScreen ? theme.typography.h3 : theme.typography.h2
            }}> Fetching clients...</Typography>
            <Loader />
        </Container>
    ) : (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h1" sx={{ fontSize: xsScreen ? theme.typography.h2 : theme.typography.h1 }}>
                Hi, {store.user.firstName}
            </Typography>
            {Object.keys(store.clients).length > 0
                && (store.clients.carer.length > 0 || store.clients.coordinator.length > 0) ?
                (<>
                    <Typography variant="h2" sx={{
                        fontSize: xsScreen ? theme.typography.h3 : theme.typography.h2
                    }}>
                        Select a client
                    </Typography>
                    <Typography variant="body1">You can switch between clients you are coordinating and/or caring for.</Typography>
                </>
                ) : null}
            <Tabs value={tabValue} onChange={handleChangeTabs} variant="scrollable">
                <Tab label="Coordinating for" component="h3" icon={<AssignmentIcon />} iconPosition="start"
                    sx={{
                        fontSize: xsScreen ? theme.typography.h6 : theme.typography.h3,
                        textTransform: "capitalize",
                        color: theme.palette.primary.main,
                        '&.Mui-selected': { color: theme.palette.primary.dark }
                    }} />
                <Tab label="Caring for" component="h3" icon={<PeopleAltIcon />} iconPosition="start"
                    sx={{
                        fontSize: xsScreen ? theme.typography.h6 : theme.typography.h3,
                        textTransform: "capitalize",
                        color: theme.palette.primary.main,
                        '&.Mui-selected': { color: theme.palette.primary.dark }
                    }} />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
                {Object.keys(store.clients).length > 0 && store.clients.coordinator.length > 0 ? (
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {store.clients.coordinator.map(client => (
                            <Client client={client} key={`coordinatingFor_${client._id}`} />
                        ))}
                    </Stack>
                ) : (
                    <Stack gap={1}>
                        <Typography variant="h4" sx={{ mt: 2 }} fontWeight="bold">
                            You aren't currently the coordinator for any clients.<br />
                        </Typography>
                        <Typography variant="body1" maxWidth="60ch">
                            Add a client to get started. You'll be able to create and manage
                            their shifts and assign carers to them.
                        </Typography>
                    </Stack>
                )}
            </TabPanel>
            <TabPanel value={tabValue} index={1} >
                {Object.keys(store.clients).length > 0 && store.clients.carer.length > 0 ? (
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {store.clients.carer.map(client => (
                            <Client client={client} key={`caringFor_${client._id}`} />
                        ))}
                    </Stack>
                ) : (
                    <Stack gap={1}>
                        <Typography variant="h4" sx={{ mt: 2 }} fontWeight="bold">
                            You aren't currently the carer for any clients.<br />
                        </Typography>
                        <Typography variant="body1" maxWidth="60ch">
                            A coordinator can assign you as a carer for a client,
                            or you can assign yourself as a carer for your own client after
                            adding them.
                        </Typography>
                    </Stack>
                )}
            </TabPanel>
            <ButtonPrimary onClick={handleAddClient} startIcon={<PersonAddAltRoundedIcon />}>
                Add client
            </ButtonPrimary>

            <Modal modalId="add-client"
                title="Add Client"
                text="You'll be the coordinator for this client and can 
            create and manage their care shifts."
            >
                <AddClientForm />
            </Modal>
        </Container>
    )
}

export default SelectClient