import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { getUserName } from "../../utils/apiUtils";
import { ButtonPrimary } from "../root/Buttons";
import Carer from "../Carer";
import Loader from "../logo/Loader";

import { Typography, Box } from "@mui/material";

const CoordinatorNotes = (props) => {
    const { store } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [coordinator, setCoordinator] = useState({});

    const openCareTeamList = useCallback(() => {
        navigate("/calendar/care-team");
        modalDispatch({
            type: "open",
            data: "modal"
        });
    }, [modalDispatch, navigate]);

    const renderContent = () => {
        if (store.selectedShift.coordinatorNotes) {
            return (
                <>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                        {store.selectedShift.coordinatorNotes}
                    </Typography>
                </>
            )
        } else {
            return (
                <Typography variant="body1">
                    There are no coordinator notes for this shift.
                </Typography>
            )
        }
    };

    useEffect(() => {
        const getCoordinator = async () => {
            const coordinator = await getUserName(store.selectedShift.coordinator);
            setCoordinator(coordinator);
            setIsLoading(false);
        }
        getCoordinator();
    }, [store.selectedShift.coordinator]);

    const ShiftCoordinatorDetails = () => {
        return (
            <Carer carer={coordinator} onClick={openCareTeamList} />
        );
    };

    return isLoading ? <Loader /> : (
        <>
            <Typography variant="h3" component="p">Coordinator Notes</Typography>
            <Box sx={{ mt: 1 }}>
                {renderContent()}
            </Box>
            <Box mt={2}>
                <ShiftCoordinatorDetails />
                <ButtonPrimary onClick={openCareTeamList}>
                    View full care team
                </ButtonPrimary>
            </Box>
        </>
    )
}

export default CoordinatorNotes