import { useEffect, useState } from "react";

import { useGlobalContext } from "../utils/globalUtils";
import { useModalContext } from "../utils/modalUtils";
import baseURL from "../utils/baseUrl";
import Patient from "../components/Patient";
import Modal from "../components/Modal";
import AddPatientForm from "../components/forms/AddPatientForm";
import { ButtonPrimary } from "../components/root/Buttons";
import Loader from "../components/logo/Loader";

import { Stack, Typography } from "@mui/material";

const SelectPatient = () => {
    const { store, dispatch } = useGlobalContext();
    const [isLoading, setIsLoading] = useState(true);

    // Unset selected patient and shifts
    useEffect(() => {
        dispatch({
            type: "setSelectedPatient",
            data: ""
        });
        dispatch({
            type: "clearShifts"
        });
    }, [dispatch]);

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
                setIsLoading(false);
            }).catch(error => console.error(error.message));
    }, [dispatch]);

    // useEffect(() => {
    //     if (store.patients.length > 0) {

    //     }
    // }, [store.patients]);

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
            <Typography variant="h2">Fetching patients...</Typography>
            <Loader />
        </>
    ) : (
        <>
            <Typography variant="h1">Hi, {store.user.firstName}</Typography>
            {(Object.keys(store.patients).length > 0
                && store.patients.carer.length > 0) || store.patients.coordinator.length > 0 ?
                <Typography variant="h2">Select a patient</Typography> : null}
            {Object.keys(store.patients).length > 0 && store.patients.carer.length > 0 ? (
                <section>
                    <Typography variant="h3">Caring for</Typography>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {store.patients.carer.map(patient => (
                            <Patient patient={patient} key={patient._id} />
                        ))}
                    </Stack>
                </section>
            ) : null}
            {Object.keys(store.patients).length > 0 && store.patients.coordinator.length > 0 ? (
                <section>
                    <Typography variant="h3">Coordinating for</Typography>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {store.patients.coordinator.map(patient => (
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
                <AddPatientForm />
            </Modal>
        </>
    )
}

export default SelectPatient