import React from 'react';
import { Button, styled, ButtonGroup } from "@mui/material";

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