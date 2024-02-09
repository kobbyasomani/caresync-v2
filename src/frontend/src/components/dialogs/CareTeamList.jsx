import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { getCarers } from "../../utils/apiUtils";
import { ButtonPrimary } from "../root/Buttons";
import Carer from "../Carer";
import Loader from "../logo/Loader";

import { List, Stack } from "@mui/material"
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const CareTeamList = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { store } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const [carers, setCarers] = useState([])
    const navigate = useNavigate();

    // Set the modal text
    useEffect(() => {
        modalDispatch({
            type: "setActiveModal",
            data: {
                title: `Care team for ${store.selectedClient.firstName} ${store.selectedClient.lastName}`,
                text: `These are the members of this client's care team. You can 
                invite users to the care team or remove them from here.`
            }
        });
    }, [modalDispatch, store.selectedClient]);

    // Get the list of client's carers
    useEffect(() => {
        getCarers(store.selectedClient._id).then(carers => {
            setCarers(carers);
            setIsLoading(false);
        });
    }, [store.selectedClient, store.shifts]);

    // Open carer invitation dialog
    const addCarer = useCallback(() => {
        navigate("/calendar/invite-carer");
    }, [navigate]);

    // console.log(carers)

    return isLoading ? <Loader /> : (
        <>
            <List>
                <Stack spacing={2}>
                    {carers.map(carer => {
                        return <Carer key={carer._id} carer={carer} />
                    })}
                </Stack>

            </List>

            <ButtonPrimary onClick={addCarer}
                startIcon={<PersonAddIcon />}>
                Add Carer
            </ButtonPrimary>
        </>
    )
}

export default CareTeamList