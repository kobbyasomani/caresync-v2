import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { getCarers, getUserName } from "../../utils/apiUtils";
import { getAllShifts } from "../../utils/apiUtils";

import { ButtonPrimary, ButtonSecondary } from "../root/Buttons";
import Carer from "../Carer";
import Loader from "../logo/Loader";

import { List, Stack, Alert } from "@mui/material"
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const CareTeamList = () => {
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();

    const [isLoading, setIsLoading] = useState(true);
    const [coordinator, setCoordinator] = useState({});
    const [carers, setCarers] = useState([])
    const [alert, setAlert] = useState({});
    const userIsCoordinator = store.user._id === store.selectedClient.coordinator;

    const navigate = useNavigate();

    // Opens carer invitation dialog
    const addCarer = useCallback(() => {
        navigate("/calendar/invite-carer");
    }, [navigate]);

    // Add logged-in user to the care team if they are the coordinator
    const addCoordinatorAsCarer = useCallback(() => {
        axios.post("/carer/add-coordinator-as-carer", {
            "coordinatorID": store.user._id,
            "clientID": store.selectedClient._id
        }).then(response => {
            setAlert({
                message: "You have been added to the care team.",
                severity: "success"
            });
            getCarers(store.selectedClient._id).then(carers => {
                setCarers(carers);
                dispatch({
                    type: "setCarers",
                    data: carers
                });
            });
        }).catch(error => setAlert({
            message: error.response.data.message,
            severity: "error"
        }));
    }, [store.user._id, store.selectedClient._id, dispatch]);

    // Remove a carer from the selected client
    const removeCarer = useCallback((carer) => {
        axios.delete(`carer/remove/${store.selectedClient._id}/${carer._id}`)
            .then(response => {
                getCarers(store.selectedClient._id).then(carers => {
                    let message;
                    if (carer._id === store.user._id) {
                        message = "You were removed from the care team."
                    } else {
                        message = `${carer.firstName} ${carer.lastName} was removed from the care team.`;
                    }
                    setAlert({
                        message: message,
                        severity: "success"
                    });
                    setCarers(carers);
                    dispatch({
                        type: "setCarers",
                        data: carers
                    });
                    getAllShifts(store.selectedClient._id)
                        .then(shifts => {
                            dispatch({
                                type: "setShifts",
                                data: shifts
                            });
                        });
                });
            }).catch(error => setAlert({
                message: error.response.data.message,
                severity: "error"
            }));
    }, [store.selectedClient, store.user._id, dispatch]);

    const getCoordinator = useCallback(async () => {
        const coordinator = await getUserName(store.selectedClient.coordinator);
        return coordinator
    }, [store.selectedClient.coordinator]);

    // Update carers on component load
    useEffect(() => {
        setIsLoading(true);
        getCoordinator(store.selectedClient.coordinator).then((coordinator) => {
            setCoordinator(coordinator);
            getCarers(store.selectedClient._id).then(carers => {
                setCarers(carers);
                dispatch({
                    type: "setCarers",
                    data: carers
                });
            }).then(() => {
                setIsLoading(false);
            });
        })
    }, [dispatch, store.selectedClient._id, getCoordinator, store.selectedClient.coordinator]);

    // Set the modal text
    useEffect(() => {
        modalDispatch({
            type: "setActiveModal",
            data: {
                title: `Care team for ${store.selectedClient.firstName} ${store.selectedClient.lastName}`,
                text: `These are the members of this client's care team. You can 
                    invite users to, or remove them from, the client's care team here.`
            }
        });
    }, [modalDispatch, store.selectedClient]);

    return isLoading ? <Loader /> : (
        <>
            <List>
                <Stack spacing={2} key="carer-list">
                    <Carer key={coordinator._id} carer={coordinator} removeCarer={() => removeCarer(coordinator)} />
                    {carers.length > 0 ? carers.filter(carer => carer._id !== store.selectedClient.coordinator)
                        .map(carer => {
                            return <Carer key={carer._id} carer={carer} removeCarer={() => removeCarer(carer)} />
                        }) : null}
                </Stack>
            </List>

            {Object.keys(alert).length > 0 ? (
                <Alert severity={alert.severity}>
                    {alert.message}
                </Alert>
            ) : null}

            {userIsCoordinator ?
                (<Stack direction="row">
                    <ButtonPrimary onClick={addCarer}
                        startIcon={<PersonAddIcon />}>
                        Add Carer
                    </ButtonPrimary>
                    {store.selectedClient.coordinator === store.user._id
                        && !store.selectedClient.carers.some(obj => obj["_id"] === store.user._id) ? (
                        <ButtonSecondary onClick={addCoordinatorAsCarer}>
                            Add yourself
                        </ButtonSecondary>
                    ) : (null)
                    }
                </Stack>) : null
            }
        </>
    )
}

export default CareTeamList