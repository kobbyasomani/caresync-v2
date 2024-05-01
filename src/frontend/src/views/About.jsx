import { useState, useCallback, useEffect, useRef } from "react";

import {
    Typography, Container, Box, Stack, Divider, Drawer, IconButton, Tooltip,
    MenuList, MenuItem, Accordion, AccordionSummary, AccordionDetails, Link,
    useTheme, useMediaQuery
} from "@mui/material"
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CloudDownloadRoundedIcon from '@mui/icons-material/CloudDownloadRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import VerticalAlignTopRoundedIcon from '@mui/icons-material/VerticalAlignTopRounded';
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';
import UnfoldLessRoundedIcon from '@mui/icons-material/UnfoldLessRounded';

export default function About() {
    const theme = useTheme();
    const xsScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [menuIsOpen, setMenuIsOpen] = useState(true);
    const [expanded, setExpanded] = useState({
        all: false,
        account: false,
        clients: false,
        carers: false,
        calendar: false,
        "shift-details": false,
        "shift-documents": false,
    });
    const drawerRef = useRef(null);

    const handleToggleSidebar = useCallback(() => {
        setMenuIsOpen(!menuIsOpen);
    }, [menuIsOpen]);

    const handleMenuSelection = useCallback((event) => {
        if (xsScreen && event.target.classList.contains("MuiMenuItem-root")
            && !event.target.classList.contains("drawer-util")) {
            setMenuIsOpen(false);
        }
    }, [xsScreen]);

    const handleToggleAccordion = useCallback((accordion) => {
        setExpanded(prev => {
            if (accordion === "all") {
                let allAccordions = {};
                for (const accordion in expanded) {
                    allAccordions[accordion] = !prev.all;
                };
                return {
                    ...prev,
                    ...allAccordions
                }
            }
            return {
                ...prev,
                [accordion]: !prev[accordion]
            }
        });
    }, [expanded]);

    const handleChangeAccordion = useCallback((accordion) => () => {
        setExpanded(prev => {
            return {
                ...prev,
                [accordion]: !prev[accordion]
            }
        });
    }, []);

    const handleScrollDrawerToTop = useCallback(() => {
        const drawer = drawerRef.current;
        if (drawer) {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            drawer.scrollTo({ top: 0, left: 0 });
        }
    }, []);

    useEffect(() => {
        const setSelectedMenuItem = () => {
            const selectedItem = document.querySelector("a > li.Mui-selected");
            if (selectedItem) {
                selectedItem.classList.remove("Mui-selected");
            }
            const hash = window.location.hash;
            if (hash) {
                const menuItem = document.querySelector(`a[href="${hash}"] > li`);
                if (menuItem) {
                    menuItem.classList.add("Mui-selected");
                }
            } else {

            }
        };
        setSelectedMenuItem();
        window.addEventListener("hashchange", setSelectedMenuItem);

        return () => {
            window.removeEventListener("hashchange", setSelectedMenuItem);
        }
    }, []);

    return (
        <>
            <Box sx={{
                position: "sticky",
                top: "1rem",
                mr: { xs: 0, sm: "1.5rem" },
                display: menuIsOpen ? "invisible" : "block"
            }}>
                <Tooltip title="Table of Contents" placement="left">
                    <IconButton color="primary" onClick={handleToggleSidebar}
                        sx={{ position: "absolute", top: "1rem", right: 0, outline: `2px solid ${theme.palette.primary.light}` }}>
                        <MenuBookRoundedIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Container maxWidth="md" sx={{ mt: 4, pr: { xs: "3rem", sm: "24px" } }} id="quick-start-guide">
                <Stack gap={xsScreen ? 1 : 4}>
                    <Box>
                        <Typography variant="h1" id="about-caresync"
                            sx={{ fontSize: xsScreen ? theme.typography.h2 : theme.typography.h1, mt: "-1rem" }}>
                            About CareSync
                        </Typography>
                        <Typography variant="h2" sx={{ fontSize: xsScreen ? theme.typography.h4 : theme.typography.h3 }}>
                            Your care calendar and shift notes companion.
                        </Typography>
                        <Typography variant="body1" sx={{ maxWidth: "70ch" }}>
                            CareSync allows small, self-managed teams of personal carers and support workers
                            to easily create and edit shift notes, incident reports, and handover information,
                            as well as providing a calendar system to help organise care shifts.
                        </Typography>
                    </Box>
                    <Box id="quick-start-guide">
                        <Typography variant="h2" id="quick-start">
                            Quick-Start Guide
                        </Typography>
                        <Drawer id="quick-start-guide-drawer"
                            variant={xsScreen ? "temporary" : "persistent"}
                            anchor="right"
                            open={menuIsOpen}
                            PaperProps={{
                                ref: drawerRef,
                                sx: {
                                    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
                                    maxWidth: { xs: "100%" }
                                }
                            }}>
                            <Box sx={{ p: 4 }}>
                                <Stack direction="row" alignItems="center" gap={1}>
                                    <Typography variant="h3">Table of Contents</Typography>
                                    <Tooltip title="Close">
                                        <IconButton onClick={handleToggleSidebar} sx={{ ml: "auto" }}
                                            aria-label="Close table of contents">
                                            <CloseRoundedIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                                <MenuList id="quick-start-menu" onClick={handleMenuSelection}>
                                    <MenuItem onClick={() => handleToggleAccordion("all")} className="drawer-util">
                                        {expanded.all ? <UnfoldLessRoundedIcon /> : <UnfoldMoreRoundedIcon />}
                                        {expanded.all ? "Collapse all" : "Expand all"}
                                    </MenuItem>
                                    <Divider color={theme.palette.grey[50]} sx={{ margin: "0 !important" }} />
                                    <Link href="#about-caresync" sx={{ textDecoration: "none" }}>
                                        <MenuItem sx={{ py: "0.715rem" }}>
                                            <HelpRoundedIcon sx={{ mr: 1, pointerEvents: "none" }} color="primary" />
                                            <Typography variant="h4" sx={{ pointerEvents: "none" }}>
                                                About CareSync
                                            </Typography>
                                        </MenuItem>
                                    </Link>
                                    <Divider color={theme.palette.grey[50]} />
                                    <Accordion elevation={0} expanded={expanded["account"]}
                                        onChange={handleChangeAccordion("account")}>
                                        <AccordionSummary expandIcon={<ArrowDropDownRoundedIcon fontSize="large" color="primary" />} >
                                            <AccountCircleRoundedIcon sx={{ mr: 1 }} color="primary" />
                                            <Typography variant="h4">Account</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Link href="#quick-start"><MenuItem>Start</MenuItem></Link>
                                            <Link href="#create-account"><MenuItem>Create an account</MenuItem></Link>
                                            <Link href="#login"><MenuItem>Log in / Log out</MenuItem></Link>
                                            <Link href="#manage-account"><MenuItem>Manage your account</MenuItem></Link>
                                            <Link href="#edit-account"><MenuItem>Edit your account details</MenuItem></Link>
                                            <Link href="#change-password"><MenuItem>Change your password</MenuItem></Link>
                                            <Link href="#delete-account"><MenuItem>Delete your account</MenuItem></Link>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Divider color={theme.palette.grey[50]} />
                                    <Accordion elevation={0} expanded={expanded["clients"]}
                                        onChange={handleChangeAccordion("clients")} >
                                        <AccordionSummary expandIcon={<ArrowDropDownRoundedIcon fontSize="large" color="primary" />} >
                                            <AssignmentIndRoundedIcon sx={{ mr: 1 }} color="primary" />
                                            <Typography variant="h4">Clients</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Link href="#manage-clients"><MenuItem>Manage clients</MenuItem></Link>
                                            <Link href="#client-list"><MenuItem>Your client list</MenuItem></Link>
                                            <Link href="#add-client"><MenuItem>Add a client</MenuItem></Link>
                                            <Link href="#select-client"><MenuItem>Select a client</MenuItem></Link>
                                            <Link href="#remove-client"><MenuItem>Remove a client</MenuItem></Link>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Divider color={theme.palette.grey[50]} />
                                    <Accordion elevation={0} expanded={expanded["carers"]}
                                        onChange={handleChangeAccordion("carers")}>
                                        <AccordionSummary expandIcon={<ArrowDropDownRoundedIcon fontSize="large" color="primary" />}>
                                            <Diversity3RoundedIcon sx={{ mr: 1 }} color="primary" />
                                            <Typography variant="h4">Carers</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Link href="#manage-carers"><MenuItem>Manage carers</MenuItem></Link>
                                            <Link href="#care-team-list"><MenuItem>The care team list</MenuItem></Link>
                                            <Link href="#invite-carer"><MenuItem>Invite a carer</MenuItem></Link>
                                            <Link href="#add-yourself"><MenuItem>Add yourself as a carer</MenuItem></Link>
                                            <Link href="#remove-carer"><MenuItem>Remove a carer</MenuItem></Link>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Divider color={theme.palette.grey[50]} />
                                    <Accordion elevation={0} expanded={expanded["calendar"]}
                                        onChange={handleChangeAccordion("calendar")}>
                                        <AccordionSummary expandIcon={<ArrowDropDownRoundedIcon fontSize="large" color="primary" />}>
                                            <CalendarMonthRoundedIcon sx={{ mr: 1 }} color="primary" />
                                            <Typography variant="h4">Calendar</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Link href="#manage-calendar"><MenuItem>Manage a client's calendar</MenuItem></Link>
                                            <Link href="#switch-client"><MenuItem>Switch the selected client</MenuItem></Link>
                                            <Link href="#toggle-calendar"><MenuItem>Toggle the calendar view</MenuItem></Link>
                                            <Link href="#shift-cards"><MenuItem>Shift cards</MenuItem></Link>
                                            <Link href="#create-shift"><MenuItem>Create a shift</MenuItem></Link>
                                            <Link href="#in-progress-shift"><MenuItem>Select the in-progress shift</MenuItem></Link>
                                            <Link href="#upcoming-shift"><MenuItem>Select the upcoming shift</MenuItem></Link>
                                            <Link href="#recent-shifts"><MenuItem>Select from recent shifts</MenuItem></Link>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Divider color={theme.palette.grey[50]} />
                                    <Accordion elevation={0} expanded={expanded["shift-details"]}
                                        onChange={handleChangeAccordion("shift-details")}>
                                        <AccordionSummary expandIcon={<ArrowDropDownRoundedIcon fontSize="large" color="primary" />}>
                                            <EventNoteRoundedIcon sx={{ mr: 1 }} color="primary" />
                                            <Typography variant="h4">Shift Details</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Link href="#shift-details"><MenuItem>Manage shift details</MenuItem></Link>
                                            <Link href="#shift-details-drawer"><MenuItem>The Shift Details Drawer</MenuItem></Link>
                                            <Link href="#shift-navigation"><MenuItem>Navigating shifts</MenuItem></Link>
                                            <Link href="#shift-overview"><MenuItem>Shift overview and status</MenuItem></Link>
                                            <Link href="#shift-edit-window"><MenuItem>The shift edit window</MenuItem></Link>
                                            <Link href="#shift-note-cards"><MenuItem>Shift note cards</MenuItem></Link>
                                            <Link href="#edit-shift"><MenuItem>Edit shift details</MenuItem></Link>
                                            <Link href="#cancel-shift"><MenuItem>Cancel a shift</MenuItem></Link>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Divider color={theme.palette.grey[50]} />
                                    <Accordion elevation={0} expanded={expanded["shift-documents"]}
                                        onChange={handleChangeAccordion("shift-documents")}>
                                        <AccordionSummary expandIcon={<ArrowDropDownRoundedIcon fontSize="large" color="primary" />}>
                                            <DescriptionRoundedIcon sx={{ mr: 1 }} color="primary" />
                                            <Typography variant="h4">Shift Documents</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Link href="#notes"><MenuItem>Add shift documentation</MenuItem></Link>
                                            <Link href="#coordinator-notes"><MenuItem>Coordinator notes</MenuItem></Link>
                                            <Link href="#shift-notes"><MenuItem>Shift notes</MenuItem></Link>
                                            <Link href="#incidents"><MenuItem>Incident reports</MenuItem></Link>
                                            <Link href="#handover"><MenuItem>Handover notes</MenuItem></Link>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Divider color={theme.palette.grey[50]} />
                                    <Link href="#" sx={{ textDecoration: "none", color: "inherit" }}
                                        onClick={handleScrollDrawerToTop}>
                                        <MenuItem className="drawer-util">
                                            <VerticalAlignTopRoundedIcon />
                                            Scroll to top
                                        </MenuItem>
                                    </Link>
                                </MenuList>
                            </Box>
                        </Drawer>
                        <Typography variant="h3" id="create-account">Create an account</Typography>
                        <Typography variant="body1">To create an account, select the <em>Start App Demo </em>
                            button on the <em>Home</em> page.</Typography>
                        <img src={require("../images/quickstart/account/create-account.jpg")}
                            alt="Create a new CareSync demo account by selecting Start App Demo" />
                        <br></br>
                        <Typography variant="h4" id="login">Log in to your account</Typography>
                        <Typography variant="body1">
                            To log in to your account, enter the email address and password for your account in the
                            login form on the <em>Home</em> page, then select the <em>Log In</em> button.
                        </Typography>
                        <img src={require("../images/quickstart/account/login.jpg")}
                            alt="The login form" />
                        <br></br>
                        <Typography variant="h4">Log out of your account</Typography>
                        <Typography variant="body1">To log out of your account, select the <em>Log Out </em>
                            <LogoutRoundedIcon /> button in the top-right of the navigation menu.
                        </Typography>
                        <img src={require("../images/quickstart/account/logout.jpg")}
                            alt="The log out button"
                            style={{ maxWidth: "128px", border: "none" }} />
                    </Box>
                    <Divider />
                    <Box id="my-account">
                        <Typography variant="h3" id="manage-account">Manage your account</Typography>
                        <Typography variant="body1">Demo accounts use auto-generated credentials (name, email, and password).
                            If you would like to access the same demo account again in future, you should
                            change (or note down) the email associated with the account, and change the auto-generated
                            password to one which you will remember.
                            <br></br>
                            <br></br>
                            <em><strong>Note:</strong> Demo accounts will be automatically deleted after 30 days.</em>
                        </Typography>
                        <br></br>
                        <Typography variant="h4" id="edit-account">Edit account details</Typography>
                        <Typography variant="body1">To edit your account, select the <em>My Account </em><AccountCircleRoundedIcon />
                            &nbsp;button in the top-right of the menu.
                            <br></br>
                            <br></br>
                            Select the <em>Edit Account Details</em> button in the <em>My Account</em> dialog and
                            modify any fields you want to change, then select the <em>Save Account Details </em>
                            button to update them.
                        </Typography>
                        <img src={require("../images/quickstart/account/my-account.jpg")}
                            alt="The My Account dialog" />
                        <Typography variant="h5" id="change-password">Change your password</Typography>
                        <Typography variant="body1">When modifying your password, you'll need to enter the new password twice for
                            confirmation.
                        </Typography>
                        <img src={require("../images/quickstart/account/new-password.jpg")}
                            alt="The new password form with a masked password entered in
                        the new password and confirm new password fields" />
                        <br></br>
                        <Typography variant="h5" id="delete-account">Delete your account</Typography>
                        <Typography variant="body1">
                            To delete your account, select the <em>Delete My Account</em> button in the <em>My Account </em>
                            dialog.
                        </Typography>
                        <img src={require("../images/quickstart/account/delete-account.jpg")}
                            alt="The delete account button"
                            style={{ maxWidth: "270px", border: "none", boxShadow: "none" }} />
                        <Typography variant="body1">
                            You will be shown a confirmation before the account is deleted. All clients for whom you
                            are the coordinator, and their associated shifts, will also be deleted. Select <em>Delete Account </em>
                            in the confirmation dialog to confirm.
                        </Typography>
                        <img src={require("../images/quickstart/account/delete-account-confirm.jpg")}
                            alt="The delete account confirmation" />
                    </Box>
                    <Divider />
                    <Box id="clients">
                        <Typography variant="h3" id="manage-clients">Manage clients</Typography>
                        <Typography variant="h4" id="client-list">Your client list</Typography>
                        <Typography variant="body1">
                            After logging into your account, you'll be redirected to the <em>Client List</em> view.
                            From here, you can toggle between the clients you are coordinating and caring for, as
                            well as add clients, remove clients, and select which client to manage.
                            <br></br>
                            <br></br>
                            You can always navigate back to the <em>Client List</em> by selecting the <em>Clients </em>
                            <AssignmentIndRoundedIcon /> button in the top-left of the navigation menu.
                        </Typography>
                        <img src={require("../images/quickstart/clients/select-client.jpg")}
                            alt="The Client List view"
                            className="full-width" />
                        <br></br>
                        <Typography variant="h4" id="add-client">Add a client</Typography>
                        <Typography variant="body1">
                            To add a new client, select the <em>Add Client</em> button at the bottom of the
                            <em> Client List</em>. Enter the first name and last name of the new client in the
                            <em> Add Client</em> dialog, then select the <em>Add Client</em> button.
                        </Typography>
                        <img src={require("../images/quickstart/clients/add-client-button.jpg")}
                            alt="The add client button"
                            style={{ maxWidth: "200px", border: "none", boxShadow: "none" }} />
                        <Typography variant="body1">
                            After adding a new client, you'll be given the option of returning to the client list,
                            or viewing the <em>Calendar </em> of the newly added client to start managing their
                            care team and shifts. The <em>Add Client</em> form remains open for convenience, if you
                            want to add multiple clients in quick succession.
                        </Typography>
                        <img src={require("../images/quickstart/clients/add-client.jpg")}
                            alt="The add client dialog with the name Jane Smith added to the name fields" />
                        <br></br>
                        <img src={require("../images/quickstart/clients/add-client-success.jpg")}
                            alt="The success alert and dialog options after adding a client: Jane Smith was added to
                        your client list. You can now coordinate their care using the claendar. The dialog options
                        are Client List and View Calendar." />
                        <Typography variant="h4" id="select-client">Select a client</Typography>
                        <Typography variant="body1">To select a client, select their card in the <em>Client List</em>.
                            You will be navigated to the <em>Calendar</em> view for the selected client.
                        </Typography>
                        <br></br>
                        <Typography variant="h4" id="remove-client">Remove a client</Typography>
                        <Typography variant="body1">To remove a client, select the <em>Remove Client</em> icon
                            button in the top-right of the client's card in the <em>Client List</em>, and confirm
                            you want to remove them in the confirmation dialog by selecting the <em>Remove </em>
                            button. All associated shifts will also be removed.
                        </Typography>
                        <img src={require("../images/quickstart/clients/remove-client.jpg")}
                            alt="A client card with the remove client icon button indicated by a tooltip"
                            style={{ border: "none", boxShadow: "none" }} />
                        <br></br>
                        <img src={require("../images/quickstart/clients/confirm-remove-client.jpg")}
                            alt="The remove client confirmation" />
                    </Box>
                    <Divider />
                    <Box id="carers">
                        <Typography variant="h3" id="manage-carers">Manage carers</Typography>
                        <Typography variant="body1">
                            A client's care team can only be managed by their coordinator.
                        </Typography>
                        <Typography variant="h4" id="care-team-list">The care team list</Typography>
                        <Typography variant="body1">
                            To view a client's care team, select the <em>Care Team</em> card in the left sidebar of the
                            <em> Calendar</em> view. A list of the client's assigned carers will open in a dialog,
                            with the coordinator as the first list item.
                            <br></br>
                            <br></br>
                            On mobile, you can access the care team list by selecting the <em>Carers </em>
                            <Diversity3RoundedIcon /> icon button next to the <em>Switch Client</em> button.
                        </Typography>
                        <img src={require("../images/quickstart/carers/care-team-mobile.jpg")}
                            alt="The care team icon button highlighted in the app's navigation area on a
                            mobile device layout" />
                        <Typography variant="h4" id="invite-carer">Invite a carer</Typography>
                        <Typography variant="body1">
                            To invite a carer to a client's care team, select the <em>Add Carer</em> button in the
                            <em> Care Team</em> dialog, then enter the carer's email address and select the
                            <em> Send Invitation</em> button.
                            <br></br>
                            <br></br>
                            The carer will recieve an email containing a confirmation
                            link at the provided address, and clicking on the URL in this link will assign them to
                            the client's care team.
                        </Typography>
                        <img src={require("../images/quickstart/carers/care-team-list.jpg")}
                            alt="The care team list dialog" />
                        <br></br>
                        <img src={require("../images/quickstart/carers/invite-carer.jpg")}
                            alt="The invite carer dialog" />
                        <Typography variant="body1">
                            <em><strong>Note:</strong> The email address must be associated with an existing CareSync account
                                at the time the carer clicks the confirmation link for the carer to be added</em>
                        </Typography>
                        <br></br>
                        <Typography variant="h4" id="add-yourself">Add yourself as a carer</Typography>
                        <Typography variant="body1">
                            If you would like to add yourself as the carer for a client that you are coordinating for,
                            select the <em>Add Yourself</em> button in the <em>Care Team</em> dialog. An alert will
                            confirm that you have been added to the client's care team.
                        </Typography>
                        <img src={require("../images/quickstart/carers/add-yourself-button.jpg")}
                            alt="The add yourself as a carer button"
                            style={{ maxWidth: "225px", border: "none", boxShadow: "none" }} />
                        <Typography variant="h4" id="remove-carer">Remove a carer</Typography>
                        <Typography variant="body1">
                            To remove a carer, select the <em>Remove Carer</em> icon button in the top-right of the
                            carer card in the <em>Care Team</em> dialog, then select the <em>Remove</em> button in
                            the confirmation dialog.
                            <br></br>
                            <br></br>
                            If you remove yourself as a carer from a client, you will still remain their coordinator.
                        </Typography>
                        <img src={require("../images/quickstart/carers/remove-carer.jpg")}
                            alt="A carer card with the remove carer icon button indicated by a tooltip"
                            style={{ border: "none", boxShadow: "none" }} />
                        <br></br>
                        <img src={require("../images/quickstart/carers/remove-carer-confirm.jpg")}
                            alt="The confirmation dialog shown before removing a carer" />
                    </Box>
                    <Divider />
                    <Box id="calendar">
                        <Typography variant="h3" id="manage-calendar">Manage a client's calendar</Typography>
                        <Typography variant="body1">
                            After selecting a client from the <em>Client List</em>, you will automatically
                            be navigated to their <em>Calendar</em> view. You can always access the calendar for
                            the currently-selected client by selecting the <em>Calendar</em> <CalendarMonthRoundedIcon />
                            &nbsp;button in the top-left of the navigation menu.
                            <br></br>
                            <br></br>
                            <em><strong>Note:</strong> The Calendar button will only appear if a client has been selected.</em>
                        </Typography>
                        <img src={require("../images/quickstart/calendar/calendar.jpg")}
                            alt="The calendar view for the selected client showing a month grid and a sidebar"
                            className="full-width" />
                        <Typography variant="h4" id="switch-client">Switch the selected client</Typography>
                        <Typography variant="body1">
                            To change the selected client, select the <em>Switch Client</em> <SwapHorizRoundedIcon />
                            &nbsp;button at  the top of the left sidebar in the <em>Calendar</em> view. You will be returned
                            to the <em>Client List</em>, and can then select a different client.
                        </Typography>
                        <img src={require("../images/quickstart/clients/switch-client.jpg")}
                            alt="The switch client button"
                            style={{ maxWidth: "300px", border: "none", boxShadow: "none" }} />
                        <Typography variant="h4" id="toggle-calendar">Toggle the calendar view</Typography>
                        <Typography variant="body1">
                            The <em>Calendar</em> displays a day grid of the current month by default.
                            Use the left and right arrows on either side of the bar at the top of the <em>Calendar </em>
                            to move backwards and forwards between the months of the year.
                            <br></br>
                            <br></br>
                            Select the <em>today</em> button to jump to the current month.
                        </Typography>
                        <img src={require("../images/quickstart/calendar/calendar-today-button.jpg")}
                            alt="The today button of the calendar highlighted in the calendar navigation bar"
                            style={{ maxWidth: "275px", border: "none", boxShadow: "none" }} />
                        <Typography variant="body1">
                            You can toggle the <em>Calendar</em> between a grid view and a list view using the button
                            to the right of the <em>today</em> button in the bar at the top of the <em>Calendar</em>.
                        </Typography>
                        <img src={require("../images/quickstart/calendar/calendar-grid-view.jpg")}
                            alt="The calendar in grid view with the toggle list view button highlighted"
                            className="full-width" />
                        <img src={require("../images/quickstart/calendar/calendar-list-view.jpg")}
                            alt="The calendar in list view with the toggle grid view button highlighted"
                            className="full-width" />
                        <Typography variant="h4" id="shift-cards">Shift cards</Typography>
                        <Typography variant="body1">
                            In the <em>Calendar</em> view, shifts appear as cards containing information for
                            quick reference.
                            <br></br>
                            <br></br>
                            A shift card displays the day and date of the shift, its start and end times, the name of the
                            carer assigned to the shift, and some icon buttons indicating whether the shift has any
                            associated coordinator notes, shift notes, handover, or incident reports.
                        </Typography>
                        <img src={require("../images/quickstart/calendar/shift-card.jpg")}
                            alt="A shift card with shift details and note icon buttons"
                            style={{ maxWidth: "min(300px, 100%)", border: "none", boxShadow: "none" }} />
                        <Typography variant="body1">
                            If the note icons are greyed out, the corresponding note is not present in the shift.
                            If they are coloured, the corresponding note is present in the shift.
                            <br></br>
                            <br></br>
                            Selecting a shift card, one of its note icon buttons, or a shift row
                            (if the <em>Calendar</em> is in grid view) will open the relevant
                            <em> Shift Details Drawer </em> for the selected shift.
                        </Typography>
                        <img src={require("../images/quickstart/calendar/shift-card.gif")}
                            alt="A shift card animation showing tooltips when hovering over the shift icon buttons."
                            style={{ border: "none", boxShadow: "none" }} />
                        <Typography variant="h4" id="create-shift">Create a shift</Typography>
                        <Typography variant="body1">
                            You can create a shift by selecting the <em>Add Shift</em> button in the sidebar of the
                            <em> Calendar</em> view (defaults to the current date), or by selecting a grid square for
                            the current or a future date in the, and then selecting <em>Add Shift</em> in the dialog
                            for the selected date.
                        </Typography>
                        <img src={require("../images/quickstart/calendar/add-shift-button.jpg")}
                            alt="A shift card with shift details and note icon buttons"
                            style={{ maxWidth: "200px", border: "none", boxShadow: "none" }} />
                        <br></br>
                        <Typography variant="body1">
                            In the <em>New Shift</em> dialog that opens, select the start time, end time, and carer
                            for the new shift, enter some coordinator notes (optional), and then select the
                            <em> Create Shift</em> button.
                        </Typography>
                        <img src={require("../images/quickstart/calendar/new-shift-dialog.jpg")}
                            alt="The new shift dialog allowing the selection of shift times, a carer,
                        and the input of coordinator notes."/>
                        <Typography variant="body1">
                            You can manage the newly created shift right away, or select <em>Create Shift</em> to
                            return to the <em>New Shift</em> form and create additional shifts.
                        </Typography>
                        <img src={require("../images/quickstart/calendar/new-shift-success.jpg")}
                            alt="The new success alert with dialog options. The options are manage shift
                        or create (another) shift." />
                        <Typography variant="h4" id="in-progress-shift">Select the in-progress shift</Typography>
                        <Typography variant="body1">
                            If a shift is currently in progress for the selected client, a <em>View In-Progress Shift </em>
                            button will appear in the sidebar of the <em>Calendar</em> view. Select it to open
                            the in-progress shift.
                            <br></br>
                            <br></br>
                            The in-progress shift will have a notice at the top of the <em>Shift Details Drawer </em>
                            indicating that it is currently in progress.
                        </Typography>
                        <img src={require("../images/quickstart/calendar/in-progress-shift-button.jpg")}
                            alt="The view in-progress shift button"
                            style={{ maxWidth: "300px", border: "none", boxShadow: "none" }} />
                        <Typography variant="h4" id="upcoming-shift">Select the next upcoming shift</Typography>
                        <Typography variant="body1">
                            If the client has at least one future shift, an upcoming shift card will appear in
                            the sidebar of the <em>Calendar</em> view. Select it, or its note icon buttons, to open
                            it in the <em>Shift Details Drawer</em>.
                        </Typography>
                        <img src={require("../images/quickstart/calendar/upcoming-shift.jpg")}
                            alt="The upcoming shift card"
                            style={{ maxWidth: "min(300px, 100%)", border: "none", boxShadow: "none" }} />
                        <Typography variant="h4" id="recent-shifts">Select from recent shifts</Typography>
                        <Typography variant="body1">
                            If the client has past shifts, up to three of the client's most recent shifts will appear as
                            cards in the sidebar of the <em> Calendar</em> view. You can select their cards, or note icon
                            buttons, to open them in the <em>Shift Details Drawer</em>.
                        </Typography>
                        <img src={require("../images/quickstart/calendar/recent-shifts.jpg")}
                            alt="The list of recent shifts highlighted in the calendar view"
                            className="full-width" />
                    </Box>
                    <Divider />
                    <Box id="shifts">
                        <Typography variant="h3" id="shift-details">Manage shift details</Typography>
                        <Typography variant="h4" id="shift-details-drawer">The Shift Details Drawer</Typography>
                        <Typography variant="body1">
                            The shift details drawer provides detailed information about a shift and is used to
                            input, review, and download shift documentation.
                        </Typography>
                        <img src={require("../images/quickstart/shift-details/shift-details-drawer.jpg")}
                            alt="The shift details drawer opened over the calendar view"
                            className="full-width" />
                        <Typography variant="h5" id="shift-navigation">Navigating shifts</Typography>
                        <Typography variant="body1">
                            The navigation bar at the top of the <em>Shift Details Drawer</em> allows you to navigate
                            between shifts in the client's calendar, and between subsections of the currently-selected
                            shift.
                            <img src={require("../images/quickstart/shift-details/shift-details-nav.jpg")}
                                alt="The shift details navigation bar"
                                className="full-width" />
                            On the left hand side of the shift navigation bar, use the left chevron, calendar, and right
                            chevron buttons to navigate to the previous shift, in-progress shift, and next shift, respectively.
                            If no in-progress shift is present, the calendar button will not appear.
                            <br></br>
                            <br></br>
                            On the right hand side of the shift navigation bar, use the left arrow, home button, and
                            close buttons to navigate 'back' in the <em>Shift Details Drawer</em>, return to the overview,
                            or close the drawer, respectively.
                        </Typography>
                        <br></br>
                        <Typography variant="h5" id="shift-overview">Shift overview and status</Typography>
                        <Typography variant="body1">
                            At the top of the <em>Shift Details Drawer</em> you will see the client's name, the carer
                            for the selected shift, the shift date, and its start and end times.
                            <img src={require("../images/quickstart/shift-details/shift-overview.jpg")}
                                alt="The shift details overview section at the top of the Shift Details Drawer"
                                className="full-width"
                                style={{ maxWidth: "min(500px, 100%)" }} />
                            <br></br>
                            For pending, in-progress, and recently-ended shifts, a notification bar will appear below the
                            shift times indicating its status.
                            <br></br>
                            <br></br>
                            Future shifts will have a blue notice indicating that they
                            are pending, in-progress shifts will have a green notice, and recently-ended shifts will have
                            a yellow notice indicating that they are still within their "edit window".
                            <br></br>
                            <br></br>
                            A shift which has ended and is no longer editable has no status indicator.
                        </Typography>
                        <br></br>
                        <Typography variant="h5" id="shift-edit-window">The shift edit window</Typography>
                        <Typography variant="body1">
                            For convenience, a shift's documents can be added and edited within a two to eight hour
                            window after the shift ends, to accommodate entering or amending notes after the shift ends.
                            <br></br>
                            <br></br>
                            If a shift has a subsequent shift within eight hours of its end time, its edit window will close
                            two hours into the start of the next shift. If a shift is the last one in the client's calendar,
                            its edit window will close eight hours after it has ended. This gives carers a time buffer
                            after the shift to add or amend their shift notes.
                        </Typography>
                        <br></br>
                        <Typography variant="h5" id="shift-note-cards">Shift note cards</Typography>
                        <Typography variant="body1">
                            The <em>Shift Overview</em> features cards with text snippets for <em>Coordinator Notes</em>,
                            <em> Shift Notes</em>, <em> Incidents</em>, and <em>Handover</em>. These cards give a preview
                            of the text content of the corresponding documents, or indicate if there is none. Selecting a
                            card will navigate to the relevant sub-section or document.
                        </Typography>
                        <img src={require("../images/quickstart/shift-details/shift-note-cards.jpg")}
                            alt="The coordinator notes, shift notes, incidents, and handover cards highlighted
                            insde the Shift Details Drawer overview"
                            className="full-width" />
                        <Typography variant="body1">
                            If the previous shift had handover notes, these will appear below the notes from the coordinator
                            under the heading "Handover from previous shift".
                        </Typography>
                        <img src={require("../images/quickstart/shift-details/previous-shift-handover.jpg")}
                            alt="The previous shift handover card as it appears in the shift overview,
                            with some sample handover text in it"
                            style={{ border: "none", boxShadow: "none" }}
                            className="full-width" />
                        <Typography variant="body1">
                            When viewing a sub-section of the <em>Shift Details Drawer</em>, a line of "breadcrumb" links
                            will appear below the shift times. Select them to navigate back to the corresponding section
                            of the <em>Shift Details Drawer</em>.
                            <br></br>
                            <br></br>
                            For example, if you are viewing an incident report, you can use the breadcrumbs to
                            navigate back to <em>Incidents</em> (the incident reports overview list)
                            or <em>Shift details</em> (the shift details overview).
                        </Typography>
                        <img src={require("../images/quickstart/shift-details/incident-report-breadcrumbs.jpg")}
                            alt="The incident report details panel with the breadcrumb navigation highlighted"
                            className="full-width" />
                        <Typography variant="h4" id="edit-shift">Edit shift details</Typography>
                        <Typography variant="body1">
                            To edit a shift, select the <em>Edit Shift</em> button at the bottom of the
                            <em> Shift Details Drawer</em> to open the <em>Edit Shift</em> dialog. From here,
                            you can adjust the shift start time, end time, carer, and coordinator notes.
                        </Typography >
                        <img src={require("../images/quickstart/shift-details/edit-shift.jpg")}
                            alt="The edit shift and cancel shift buttons"
                            className="full-width"
                            style={{ maxWidth: "min(350px, 100%)", border: "none", boxShadow: "none" }} />
                        <Typography variant="body1">
                            <em><strong>Note:</strong> The shift start time cannot be modified once the shift has commenced.</em>
                        </Typography>
                        <br></br>
                        <Typography variant="h4" id="cancel-shift">Cancel a shift</Typography>
                        <Typography variant="body1">
                            A shift can be cancelled if it is pending, or if it is a sample shift that was automatically
                            created with your demo account.
                            <br></br>
                            <br></br>
                            To cancel a shift, select the <em>Cancel Shift</em> button at the bottom of the
                            <em> Shift Details Drawer</em>. In the confirmation dialog that opens, you can
                            review a summary of the shift you are about to cancel, including its client,
                            start and end times, and carer.
                            <br></br>
                            <br></br>
                            To confirm, select the <em> Cancel Shift</em> button
                            and the shift will be removed.
                        </Typography>
                        <img src={require("../images/quickstart/shift-details/confirm-cancel-shift.jpg")}
                            alt="The cancel shift confirmation dialog" />
                        <Divider />
                        <Typography variant="h3" id="notes">Add shift documentation</Typography>
                        <Typography variant="h4" id="coordinator-notes">Coordinator notes</Typography>
                        <Typography cariant="body1">
                            As a client's coordinator, you can add and modify coordinator notes to a shift during
                            shift creation, or while the shift is still editable (that is, pending, in-progress, or
                            inside its <Link href="#shift-edit-window">edit window</Link>).
                        </Typography>
                        <img src={require("../images/quickstart/shift-details/coordinator-notes.jpg")}
                            alt="The coordinator notes card as it appears in the shift overview, with some sample text in it"
                            style={{ maxWidth: "min(500px, 100%)", border: "none", boxShadow: "none" }} />
                        <Typography variant="body1">
                            Coordinator notes, if present, appear at the top of the <em>Shift Details Drawer</em>,
                            and can be used to provide tips, reminders, or other useful information that the carer
                            should know during the shift.
                        </Typography>
                        <br></br>
                        <Typography variant="h4" id="shift-notes">Shift notes</Typography>
                        <Typography variant="body1">
                            A shift's carer can add shift notes while a shift is in progress or in its&nbsp;
                            <Link href="#shift-edit-window">edit window</Link>. Use Shift Notes to give an overview of
                            the main events of the care shift for later reference.
                            <br></br>
                            <br></br>
                            To add shift notes, select the <em>Shift Notes</em> card in the <em>Shift Details Drawer</em>,
                            enter your notes, and select the <em>Submit Shift Notes</em> button.
                        </Typography>
                        <img src={require("../images/quickstart/shift-details/shift-notes-card.jpg")}
                            alt="The shift notes notes card as it appears in the shift overview"
                            style={{ maxWidth: "min(600px, 100%)", border: "none", boxShadow: "none" }} />
                        <img src={require("../images/quickstart/shift-details/submit-shift-notes.jpg")}
                            alt="The filled shift notes form textarea with the submit shift notes button highlighted"
                            className="full-width" />
                        <Typography cariant="body1">
                            Once submitted, shift notes can be edited (while the shift is in progress or in
                            its <Link href="#shift-edit-window">edit window</Link>), cleared (deleted), and
                            downloaded as a PDF by selecting the <em>Cloud Download </em>
                            <CloudDownloadRoundedIcon /> icon button.
                            <br></br>
                            <br></br>
                            To clear shift notes, select the <em>Clear</em> button while viewing the shift notes,
                            and then select <em>Clear</em> again in the confirmation to remove them.
                        </Typography>
                        <img src={require("../images/quickstart/shift-details/edit-clear-shift-notes.jpg")}
                            alt="Shift notes with the edit and clear shift notes buttons highlighted"
                            className="full-width" />
                        <Typography variant="h4" id="incidents">Incident reports</Typography>
                        <Typography variant="body1">
                            A shift's carer can add incident reports while a shift is in progress or in
                            its <Link href="#shift-edit-window">edit window</Link>. Create Incident Reports
                            to document events during the shift that impact a client's health,
                            safety, or general wellbeing.
                            <br></br>
                            <br></br>
                            Incident Reports might include documentation of accidents or injuries, observed behaviour and
                            emotional state, environmental factors, or any other daily living or quality of life issues that
                            need to be recorded for later reference.
                            <br></br>
                            <br></br>
                            To add an incident report, select the <em>Incidents</em> card in the
                            <em>Shift Details Drawer</em>, then select the <em>Create Incident Report </em>
                            button. Enter your incident report text, then select <em>Submit Incident Report</em>.
                        </Typography>
                        <img src={require("../images/quickstart/shift-details/incidents-card.jpg")}
                            alt="The incidents card as it appears in the shift overview"
                            style={{ maxWidth: "min(350px, 100%)", border: "none", boxShadow: "none" }} />
                        <img src={require("../images/quickstart/shift-details/create-incident-report.jpg")}
                            alt="The incident reports list with the create incident report button highlighted"
                            className="full-width" />
                        <img src={require("../images/quickstart/shift-details/submit-incident-report.jpg")}
                            alt="The filled incident report form textarea with the submit incident report button highlighted"
                            className="full-width" />
                        <Typography variant="body1">
                            Once added, incident reports can be edited (while the shift is in progress or in
                            its <Link href="#shift-edit-window">edit window</Link>), deleted, and downloaded as a PDF.
                            <br></br>
                            <br></br>
                            To delete incident reports, select the <em>Delete</em> button while viewing an incident
                            report, and then select <em>Delete</em> again in the confirmation to remove them. You
                            can also delete an incident report by selecting the <em>Delete Incident</em> button in
                            the top-right corner of an incident report card in the <em>Incident Reports</em> overview
                            list.
                        </Typography>
                        <img src={require("../images/quickstart/shift-details/delete-incident.jpg")}
                            alt="An incident report in the incidents list with the delete incident icon button
                        highlighted"
                            className="full-width" />
                        <Typography variant="h4" id="handover">Handover notes</Typography>
                        <Typography variant="body1">
                            A shift's carer can add handover notes while a shift is in progress or in
                            its <Link href="#shift-edit-window">edit window</Link>. Use handover notes to provide
                            information that will be useful for the client's next shift, such as things that need
                            to be followed up on.
                            <br></br>
                            <br></br>
                            If the shift is the last shift in the client's calendar, the handover notes will continue
                            to be editable after the shift's <Link href="#shift-edit-window">edit window</Link>, until
                            another shift is added.
                            <br></br>
                            <br></br>
                            To add handover notes, select the <em>Handover</em> card in the <em>Shift Details Drawer</em>,
                            enter your handover text, and select the <em>Submit Handover Notes</em> button.
                        </Typography>
                        <img src={require("../images/quickstart/shift-details/handover-card.jpg")}
                            alt="The handover notes card as it appears in the shift overview"
                            style={{ maxWidth: "min(350px, 100%)", border: "none", boxShadow: "none" }} />
                        <img src={require("../images/quickstart/shift-details/submit-handover.jpg")}
                            alt="The filled handover notes form textarea with the submit handover notes button highlighted"
                            className="full-width" />
                        <Typography variant="body1">
                            Once added, handover notes can be edited or cleared while the shift is in progress or in
                            its <Link href="#shift-edit-window">edit window</Link>. To clear handover notes, select
                            the <em>Clear</em> button while viewing the handover notes, and then select <em>Clear</em> again
                            in the confirmation to remove them.
                        </Typography>
                        <img src={require("../images/quickstart/shift-details/edit-clear-handover.jpg")}
                            alt="Handover notes with the edit and clear handover buttons highlighted"
                            className="full-width" />
                    </Box>
                </Stack >
            </Container >
        </>
    );
}