import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { getUserName } from "../../utils/apiUtils";
import { ButtonPrimary, ButtonSecondary } from "../root/Buttons";
import Carer from "../Carer";
import Loader from "../logo/Loader";

import { Typography, Box, Stack, useMediaQuery, useTheme, Fade, Grow } from "@mui/material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import Diversity3Icon from '@mui/icons-material/Diversity3';

const CoordinatorNotes = (props) => {
    const { store } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const navigate = useNavigate();
    const { shiftUtils } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [coordinator, setCoordinator] = useState({});

    const theme = useTheme();
    const xsScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const handleOpenCareTeamList = useCallback(() => {
        modalDispatch({
            type: "open",
            data: "modal",
            id: "care-team-list"
        });
        navigate("/calendar/care-team");
    }, [modalDispatch, navigate]);

    const handleEditShift = useCallback(() => {
        modalDispatch({
            type: "open",
            data: "modal",
            id: "edit-shift"
        });
        navigate("/calendar/edit-shift")
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
            <Carer carer={coordinator} onClick={handleOpenCareTeamList} />
        );
    };

    return isLoading ? <Loader /> : (
        <>
            <Fade in={true}>
                <Typography variant="h3" component="p">Coordinator Notes</Typography>
            </Fade>
            <Grow in={true}>
                <Box sx={{ mt: 1 }}>
                    {renderContent()}
                </Box>
            </Grow>
            <Grow in={true}>
                <Box mt={2}>
                    <ShiftCoordinatorDetails />
                    <Stack direction="row" gap={2} justifyContent="center" mt={2}>
                        {store.selectedClient.isCoordinator
                            && (shiftUtils.isPending || shiftUtils.isInProgress) ?
                            <ButtonPrimary onClick={handleEditShift} startIcon={<AssignmentIcon />}
                                sx={{ margin: "0" }}>
                                Edit notes
                            </ButtonPrimary>
                            : null}
                        <ButtonSecondary onClick={handleOpenCareTeamList} startIcon={<Diversity3Icon />}
                            sx={{ margin: "0" }}>
                            {xsScreen ? "Care team" : "View full care team"}
                        </ButtonSecondary>
                    </Stack>
                </Box>
            </Grow>
        </>
    )
}

export default CoordinatorNotes