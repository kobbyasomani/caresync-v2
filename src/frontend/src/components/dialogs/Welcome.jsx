import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { baseURL_API } from "../../utils/baseURL";
import Modal from "../Modal";
import { ButtonPrimary } from "../root/Buttons";

import { Link, Button, MobileStepper, useTheme, Typography } from "@mui/material";
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const Welcome = () => {
    const { store, dispatch } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const theme = useTheme();
    const navigate = useNavigate();

    const handleDismissWelcome = useCallback(async () => {
        fetch(`${baseURL_API}/user/my-account`, {
            credentials: "include",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                isNewUser: false
            })
        }).then(response => response.json())
            .then(user => {
                dispatch({
                    type: "setUser",
                    data: {
                        ...store.user,
                        isNewUser: user.isNewUser
                    }
                });
            });
    }, [dispatch, store.user]);

    const handleOpenQuickStartGuide = useCallback(async (event) => {
        event.preventDefault();
        await handleDismissWelcome();
        navigate("/about#quick-start-guide");
    }, [handleDismissWelcome, navigate]);

    const handleOpenMyAccount = useCallback(async () => {
        await handleDismissWelcome();
        modalDispatch({
            type: "open",
            data: "modal",
            id: "my-account"
        });
    }, [modalDispatch, handleDismissWelcome]);

    // Welcome dialog stepper
    const [activeStep, setActiveStep] = useState(0);
    const stepperContent = [
        {
            intro: "Your care shift companion app.",
            content: <Typography variant="body1">
                CareSync helps you to schedule and document care shifts for multiple clients and
                carers, keeping shift notes, incident reports, and handover in one place.
            </Typography>
        },
        {
            intro: "Manage client calendars.",
            content: <Typography variant="body1">
                Your account includes a sample client with an in-progress shift in their calendar.
                You can explore and edit these to get a feel for the app's features, or remove them and
                add your own clients and shifts.</Typography>
        },
        {
            intro: "Finish setting up your account.",
            content: <>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    This demo account uses auto-generated credentials. If you'd like to log in to it again,
                    edit your account and set your own password and other account details.
                    <br></br>
                    <br></br>
                    For more help getting started, visit the <Link href="#" onClick={handleOpenQuickStartGuide}>
                        Quick Start Guide</Link> by selecting <HelpRoundedIcon fontSize="small" sx={{ transform: "translateY(0.2rem)" }} /> About
                    in the top menu.
                </Typography>
                <ButtonPrimary startIcon={<AccountCircleRoundedIcon />} onClick={handleOpenMyAccount}>
                    My Account
                </ButtonPrimary>
            </>
        }];
    const maxSteps = stepperContent.length;

    const handleNext = useCallback(() => {
        if (activeStep < maxSteps - 1) {
            setActiveStep(prev => prev + 1);
        }
    }, [activeStep, maxSteps]);

    const handleBack = useCallback(() => {
        if (activeStep > 0) {
            setActiveStep(prev => prev - 1);
        }
    }, [activeStep]);

    useEffect(() => {
        modalDispatch({
            type: "open",
            data: "modal",
            id: "welcome"
        });
    }, [modalDispatch]);

    return store.user?.isNewUser ? (
        <Modal modalId="welcome"
            title="Welcome to CareSync"
            text={stepperContent[activeStep].intro}
            actions={
                <MobileStepper
                    sx={{ width: "100%", mt: 0.5 }}
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                        <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                            Next
                            {theme.direction === 'rtl' ? (
                                <KeyboardArrowLeftRoundedIcon />
                            ) : (
                                <KeyboardArrowRightRoundedIcon />
                            )}
                        </Button>
                    }
                    backButton={
                        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                            {theme.direction === 'rtl' ? (
                                <KeyboardArrowRightRoundedIcon />
                            ) : (
                                <KeyboardArrowLeftRoundedIcon />
                            )}
                            Back
                        </Button>
                    }
                />
            }
            onClose={handleDismissWelcome}>
            {stepperContent[activeStep].content}
        </Modal>
    ) : null;
}

export default Welcome