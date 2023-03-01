import { createTheme } from "@mui/material/styles";

// Access the default theme settings using 'dtheme'
const dtheme = createTheme();

// Define global font and fallback for the application
const fontFamily = ["Arial", "Helvetica", "sans-serif"].join(",");

// Define a new theme
let Theme = createTheme({
    palette: {
        primary: {
            main: "#79589fff",
        }
    },
    typography: {
        fontFamily: fontFamily,
        h1: {
            fontWeight: "bold",
            fontSize: "2.4rem",
        },
        h2: {
            fontWeight: "bold",
            fontSize: "1.8rem",
        },
        h3: {
            fontWeight: "bold",
            fontSize: "1.4rem",
        },
        h4: {
            fontWeight: "bold",
            fontSize: "1.3rem",
        },
        h5: {
            fontWeight: "bold",
            fontSize: "1.2rem",
        },
        h6: {
            fontWeight: "bold",
            fontSize: "1.1rem",
        },
    },
    components: {
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    width: "70%",
                    borderTopLeftRadius: dtheme.shape.borderRadius,
                    borderBottomLeftRadius: dtheme.shape.borderRadius,
                    [dtheme.breakpoints.down("sm")]: {
                        width: "100%",
                        height: "100%",
                        top: 0,
                        borderRadius: 0,
                    }
                }
            }
        }
    }
});

export { Theme };