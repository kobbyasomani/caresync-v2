import React from "react";
import { useEffect, useState } from "react";

import { useGlobalContext } from "../utils/globalUtils";
import { useModalContext } from "../utils/modalUtils";
import baseURL from "../utils/baseUrl";
import Client from "../components/Client";
import Modal from "../components/Modal";
import AddClientForm from "../components/forms/AddClientForm";
import { ButtonPrimary } from "../components/root/Buttons";
import Loader from "../components/logo/Loader";

import { Stack, Typography } from "@mui/material";

const SelectClient = () => {
    const { store, dispatch } = useGlobalContext();
    const [isLoading, setIsLoading] = useState(true);

    // Unset selected client and shifts
    useEffect(() => {
        dispatch({
            type: "setSelectedClient",
            data: ""
        });
        dispatch({
            type: "clearShifts"
        });
    }, [dispatch]);

    // Fetch the list of clients for the logged-in user
    useEffect(() => {
        fetch(`${baseURL}/user`, {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(response => response.json())
            .then(clients => {
                dispatch({
                    type: "setClients",
                    data: clients
                });
                setIsLoading(false);
            }).catch(error => console.error(error.message));
    }, [dispatch]);

    // useEffect(() => {
    //     if (store.clients.length > 0) {

    //     }
    // }, [store.clients]);

    // Modal state manager
    const { modalDispatch } = useModalContext();
    const openModal = () => {
        modalDispatch({
            type: "open",
            data: "modal"
        });
    }

    return isLoading ? (
        <>
            <Typography variant="h1">Hi, {store.user.firstName}</Typography>
            <Typography variant="h2">Fetching clients...</Typography>
            <Loader />
        </>
    ) : (
        <>
            <Typography variant="h1">Hi, {store.user.firstName}</Typography>
            {Object.keys(store.clients).length > 0
                && (store.clients.carer.length > 0 || store.clients.coordinator.length > 0) ?
                <Typography variant="h2">Select a client</Typography> : null}
            {Object.keys(store.clients).length > 0 && store.clients.carer.length > 0 ? (
                <section>
                    <Typography variant="h3">Caring for</Typography>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {store.clients.carer.map(client => (
                            <Client client={client} key={client._id} />
                        ))}
                    </Stack>
                </section>
            ) : null}
            {Object.keys(store.clients).length > 0 && store.clients.coordinator.length > 0 ? (
                <section>
                    <Typography variant="h3">Coordinating for</Typography>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {store.clients.coordinator.map(client => (
                            <Client client={client} key={client._id} />
                        ))}
                    </Stack>
                </section>
            ) : (
                <Typography variant="h3">
                    You aren't currently the coordinator for any clients.<br />
                    Add a client to get started.
                </Typography>
            )}

            <ButtonPrimary onClick={openModal}>
                Add client
            </ButtonPrimary>

            <Modal
                title="Add Client"
                text="You'll be the coordinator for this client and can 
            create and manage their care shifts."
            >
                <AddClientForm />
            </Modal>
        </>
    )
}

export default SelectClient