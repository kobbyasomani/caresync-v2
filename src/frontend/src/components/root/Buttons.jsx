import { React, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useModalContext } from "../../utils/modalUtils";

import { Button, styled, ButtonGroup } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';


// mui Button style override
const StyledButton = styled(Button)({
    borderRadius: "3rem",
})

// Primary button component
export const ButtonPrimary = ({ children, variant, ...rest }) => {
    return <StyledButton variant={variant || "contained"}
        component={rest.component}
        onClick={rest.onClick}
        to={rest.to}
        sx={{
            my: 2,
            mx: "auto",
            display: "flex"
        }}
        {...rest}>
        {children}
    </StyledButton >
}

// Secondary button component
export const ButtonSecondary = ({ onClick, children, to, component, ...rest }) => {
    return <StyledButton variant="outlined"
        component={component}
        onClick={onClick}
        to={to}
        sx={{
            my: 2,
            mx: "auto",
            display: "flex"
        }}
        {...rest}>
        {children}
    </StyledButton >
}

/**
 * Button group component.
 * Use it to wrap inline buttons for back/forward user journey flow.
*/
export const ActionButtonGroup = ({ children }) => {
    return <ButtonGroup size="secondary" sx={{
        display: "flex",
        justifyContent: "space-between"
    }}>
        {children}
    </ButtonGroup>
}

// Add carer button (opens modal)
export const ButtonAddCarer = () => {
    const { modalDispatch } = useModalContext();
    const navigate = useNavigate();

    // Navigate to carer invitation dialog
    const addCarer = useCallback(() => {
        navigate("/calendar/invite-carer");

        // Make sure the modal is open
        modalDispatch({
            type: "open",
            data: "modal"
        });
    }, [navigate, modalDispatch]);

    return (
        <ButtonPrimary onClick={addCarer}
            startIcon={<PersonAddIcon />}>
            Add Carer
        </ButtonPrimary>
    );
}