import { useEffect, useState } from "react";

import { useGlobalState } from "../utils/globalStateContext";
import { useModalContext, useSetModal } from "../utils/modalUtils";
import baseURL from "../utils/baseUrl";
import Patient from "../components/Patient";
import Modal from "../components/Modal";
import AddPatient from "../components/forms/AddPatient";
import { ButtonPrimary } from "../components/root/Buttons";

import { Stack, Typography } from "@mui/material";

const SelectPatient = () => {
    const { store, dispatch } = useGlobalState();
    const [isLoading, setIsLoading] = useState(true);
    const [patients, setPatients] = useState([]);

    // Modal state manager
    const { modalStore, modalDispatch } = useModalContext()
    const isOpen = modalStore.modalIsOpen;

    const openModal = () => {
        modalDispatch({
            type: "open",
            data: "modal"
        });
    }

    // Fetch the list of patients for the logged-in user
    useEffect(() => {
        fetch(`${baseURL}/user`, {
            credentials: "include"
        }).then(response => response.json())
            .then(patients => {
                dispatch({
                    type: "setPatients",
                    data: patients
                });
                setPatients(patients);
                setIsLoading(false);
            }).catch(error => console.error(error.message));
    }, [dispatch]);

    return isLoading ? (
        <>
            <Typography variant="h1">Hi, {store.user}</Typography>
            <Typography variant="h2">Fetching patients...</Typography>
        </>
    ) : (
        <>
            <Typography variant="h1">Hi, {store.user}</Typography>
            {(patients
                && patients.carer.length > 0) || patients.coordinator.length > 0 ?
                <Typography variant="h2">Select a patient</Typography> : null}
            {patients && patients.carer.length > 0 ? (
                <section>
                    <Typography variant="h3">Caring for</Typography>
                    <Stack spacing={2}>
                        {patients.carer.map(patient => (
                            <Patient patient={patient} key={patient._id} />
                        ))}
                    </Stack>
                </section>
            ) : null}
            {patients && patients.coordinator.length > 0 ? (
                <section>
                    <Typography variant="h3">Coordinating for</Typography>
                    <Stack spacing={2}>
                        {patients.coordinator.map(patient => (
                            <Patient patient={patient} key={patient._id} />
                        ))}
                    </Stack>
                </section>
            ) : (
                <h2>Add a patient to get started.</h2>
            )}

            <ButtonPrimary onClick={openModal}>
                Add patient
            </ButtonPrimary>

            <Modal
                title="Add Patient"
                text="You'll be the coordinator for this patient and can 
            create and manage their care shifts."
            >
                <AddPatient />
            </Modal>
        </>
    )
}

export default SelectPatient