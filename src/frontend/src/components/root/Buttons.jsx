import { useCallback, useEffect, useState, useMemo } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { plusHours } from "../../utils/dateUtils";
import { Theme as theme } from "../../styles/Theme";

import { Button, styled, ButtonGroup, IconButton, Tooltip } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MoreTimeIcon from '@mui/icons-material/MoreTime';

// mui Button style override
const StyledButton = styled(Button)({
    borderRadius: "3rem",
})

// Primary button component
export const ButtonPrimary = ({ variant, children, ...rest }) => {
    return <StyledButton variant={variant || "contained"}
        // component={rest.component}
        // onClick={rest.onClick}
        // to={rest.to}
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
        modalDispatch({
            type: "open",
            data: "modal",
            id: "invite-carer"
        });
        navigate("/calendar/invite-carer");
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
                id="download-button"
                onClick={downloadResource}
                {...rest}
            >
                <CloudDownloadIcon />
            </IconButton>
        </Tooltip>
    );
}

// Upload resource icon button
/**
 * A button that uploads the specified resource to the provided URL on click.
 * @param {string} resource The resource to upload.
 * @param {string} destinationURL The URL to upload the resource to.
 * @param {string} callback A callback function to execute with the response data as its argument.
 * @param {string} tooltip The tooltip to display when hovering over the button
 * @returns 
 */
export const ButtonUpload = ({ resource, destinationURL, callback, tooltip, ...rest }) => {
    const uploadResource = useCallback(async () => {
        const response = await fetch(destinationURL, {
            method: "POST",
            date: resource
        }).then(response => response.json())
            .then((json) => {
                if (callback) {
                    callback(json);
                }
                return JSON.stringify({ message: "The file was successfully uploaded." });
            }).catch((error) => {
                return JSON.stringify({ message: error.message });
            });

        return response;
    }, [resource, destinationURL, callback]);

    return (
        <Tooltip title={tooltip} placement="left" >
            <IconButton color="primary" size="large"
                sx={{ ml: "auto", backgroundColor: "#eef1f6ff" }}
                variant="contained"
                id="upload-button"
                onClick={uploadResource}
                {...rest}
            >
                <CloudUploadIcon />
            </IconButton>
        </Tooltip>
    );
}

// Add Shift button (opens modal)
export const SidebarButtonAddShift = ({ variant, calendarApi }) => {
    const { store } = useGlobalContext();
    const { modalDispatch } = useModalContext();
    const [breakpoint, setBreakpoint] = useState('xs');
    const buttonDefaults = useMemo(() => {
        return {
            xs: "full",
            sm: "full",
            md: "full",
            lg: "full",
            xl: "icon-only",
            ...variant,
        }
    }, [variant]);
    const [buttonVariant, setButtonVariant] = useState(buttonDefaults['xs']);
    const navigate = useNavigate();

    const handleAddShift = useCallback(() => {
        const currentDateStart = new Date(new Date().setHours(0, 0, 0, 0));
        const currentDateEnd = plusHours(new Date(new Date().setHours(0, 0, 0, 0)), 24);
        calendarApi().select(currentDateStart, currentDateEnd);

        modalDispatch({
            type: "open",
            data: "modal",
            id: "add-shift"
        });
        navigate("/calendar/add-shift");
    }, [calendarApi, modalDispatch, navigate]);

    // Get the current breakpoint token key
    function getBreakpoint() {
        const windowWidth = window.innerWidth;
        let breakpoint = 'xs'
        if (windowWidth > theme.breakpoints.values.xs) breakpoint = 'sm';
        if (windowWidth > theme.breakpoints.values.sm) breakpoint = 'md';
        if (windowWidth > theme.breakpoints.values.md) breakpoint = 'lg';
        if (windowWidth > theme.breakpoints.values.lg) breakpoint = 'xl';

        return breakpoint;
    }

    // Handle switching between variants depending on viewport resize
    useEffect(() => {
        function handleResize() {
            let newBreakpoint = getBreakpoint();
            setBreakpoint(newBreakpoint);
            setButtonVariant(buttonDefaults[newBreakpoint]);
        }

        handleResize();
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [breakpoint, buttonDefaults, variant, buttonVariant]);

    return store.selectedClient.coordinator === store.user._id ? (
        buttonVariant === "icon-only" ? (
            <Tooltip title="Add Shift" placement="right">
                <IconButton sx={{
                    color: "white",
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                    },
                    position: "absolute", top: "0.5rem", right: "0.75rem",
                }} onClick={handleAddShift}>
                    <MoreTimeIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        ) : buttonVariant === "full" ? (
            <ButtonPrimary startIcon={<MoreTimeIcon />} onClick={handleAddShift} size={breakpoint === "sm" ? "small" : "medium"}
                sx={{
                    position: { xs: "absolute", lg: "relative" },
                    top: { xs: "0.75rem", lg: "initial" },
                    right: { xs: "0.75rem", lg: "initial" },
                    margin: { lg: "0.5rem auto" },
                    display: "flex"
                }}>
                Add Shift
            </ButtonPrimary >
        ) : (null)
    ) : (null);
}