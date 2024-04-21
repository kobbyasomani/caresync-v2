import { useCallback, useEffect, useState, useMemo } from "react";
import React from "react";

import { useGlobalContext } from "../../utils/globalUtils";
import { useModalContext } from "../../utils/modalUtils";
import { plusHours } from "../../utils/dateUtils";
import { uploadResource } from "../../utils/apiUtils";
import { Theme as theme } from "../../styles/Theme";

import { Button, styled, ButtonGroup, IconButton, Tooltip } from "@mui/material";
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MoreTimeRoundedIcon from '@mui/icons-material/MoreTimeRounded';
import SyncIcon from '@mui/icons-material/Sync';

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

    // Navigate to carer invitation dialog
    const addCarer = useCallback(() => {
        modalDispatch({
            type: "open",
            data: "modal",
            id: "invite-carer"
        });
    }, [modalDispatch]);

    return (
        <ButtonPrimary onClick={addCarer}
            startIcon={<PersonAddAltRoundedIcon />}>
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
            <IconButton color="primary" size="medium"
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
 * A button that uploads the specified resource to the provided URL on click,
 * and passes a response alert object and an updated resource (if applicable)
 * to the provided callback function.
 * 
 * If successful, the response alert object severity will be "success",
 * otherwise it will be "error", with the error message as the alert message.
 * @param {Object} resource The resource to upload.
 * @param {String} resourceName The name of the resource to be displayed in response messages.
 * @param {String} destinationURL The URL to upload the resource to.
 * @param {Function} callback A callback function that receives the response alert object as an argument.
 * @param {Boolean} returnResource If true, will pass the updated resource object (parsed from JSON) to the
 * callback, as the second argument after the response alert.
 * @param {Function} setParentIsLoading An optional function to set a loading state in the parent component.
 * If supplied, the given loading state will reflect the `isUploading` state of the upload button.
 * @param {String} tooltip The tooltip to display when hovering over the button.
 */
export const ButtonUpload = ({ resource, resourceName, destinationURL, callback, returnResource,
    setParentIsLoading, tooltip, ...rest }) => {
    const [isUploading, setIsUploading] = useState(false);

    const handleUploadResource = useCallback(async () => {
        if (callback) {
            setIsUploading(true);
            if (setParentIsLoading) {
                setParentIsLoading(true);
            }
            uploadResource(resource, resourceName, destinationURL)
                .then(async (response) => {
                    let updatedResource;
                    if (returnResource) {
                        updatedResource = response.json;
                    }
                    setIsUploading(false);
                    if (setParentIsLoading) {
                        setParentIsLoading(false);
                    }
                    callback({ severity: "success", "message": response.message }, updatedResource);
                }).catch(error => {
                    callback({ severity: "error", "message": error.message });
                });
        } else {
            console.log("Oops! It looks like this action is not possible at the moment.");
        }
    }, [resource, resourceName, destinationURL, callback, returnResource, setParentIsLoading]);

    return (
        <Tooltip title={tooltip} placement="left" >
            <IconButton color="primary" size="medium"
                sx={{
                    ml: "auto",
                    backgroundColor: "#eef1f6ff",
                }}
                variant="contained"
                id="upload-button"
                onClick={handleUploadResource}
                disabled={isUploading}
                {...rest}
            >
                {!isUploading ? <CloudUploadIcon />
                    : <SyncIcon sx={{ animation: `uploadingSpin 1s linear infinite` }} />}
            </IconButton>
        </Tooltip>
    );
}

// Add Shift button (opens modal)
export const SidebarButtonAddShift = ({ variant, calendarApi, setAddShiftFormTrigger }) => {
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
    const [buttonVariant, setButtonVariant] = useState(buttonDefaults[getBreakpoint()]);

    const handleAddShift = useCallback(() => {
        const currentDateStart = new Date(new Date().setHours(0, 0, 0, 0));
        const currentDateEnd = plusHours(new Date(new Date().setHours(0, 0, 0, 0)), 24);
        calendarApi().select(currentDateStart, currentDateEnd);
        setAddShiftFormTrigger("sidebar");
        modalDispatch({
            type: "open",
            data: "modal",
            id: "add-shift"
        });
    }, [calendarApi, modalDispatch, setAddShiftFormTrigger]);

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

    return store.selectedClient.coordinator._id === store.user._id ? (
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
                    <MoreTimeRoundedIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        ) : buttonVariant === "full" ? (
            <ButtonPrimary startIcon={<MoreTimeRoundedIcon />}
                onClick={handleAddShift}
                size={["xs", "sm", "md", "lg"].includes(breakpoint) ? "small" : "medium"}
                sx={{
                    position: { xs: "absolute", lg: "relative" },
                    top: { xs: "0.6rem", lg: "initial" },
                    right: { xs: "0.75rem", lg: "initial" },
                    margin: { lg: "0.5rem auto" },
                    display: "flex"
                }}>
                Add Shift
            </ButtonPrimary >
        ) : (null)
    ) : (null);
}