import { useCallback } from "react";
import  React from "react";
import { useNavigate } from "react-router-dom";

import { useModalContext } from "../../utils/modalUtils";

import { Button, styled, ButtonGroup, IconButton, Tooltip } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

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

// Download resource icon button
/**
 * A button that downloads the resource located at the proved URL on click.
 * @param {string} resourceURL The URL of the resource to download.
 * @param {string} tooltip The tooltip to display when hovering over the button
 * @returns 
 */
export const ButtonDownload = ({ resourceURL, tooltip, filename, ...rest }) => {
    const downloadResource = useCallback(() => {
        const anchor = document.createElement("a");
        anchor.href = resourceURL;
        anchor.setAttribute("download", filename);
        anchor.setAttribute("target", "_blank");
        anchor.click();
    }, [filename, resourceURL]);

    return (
        <Tooltip title={tooltip} placement="left" >
            <IconButton color="primary" size="large"
                sx={{ ml: "auto", backgroundColor: "#eef1f6ff" }}
                variant="contained"
                id="care-team-button"
                onClick={downloadResource}
                {...rest}
            >
                <CloudDownloadIcon />
            </IconButton>
        </Tooltip>
    );
}