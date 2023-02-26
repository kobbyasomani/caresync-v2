import { createTheme } from "@mui/material/styles";

// Define global font and fallback for the application
const fontFamily = ["Arial", "Helvetica", "sans-serif"].join(",");

let DefaultTheme = createTheme({
    palette: {
        primary: {
            main: "#6000D6",
        }
    },
    typography: {
        fontFamily: fontFamily,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `

        `},
        MuiTypography: {
            variants: [
                {
                    props: { variant: "h1" },
                    style: {
                        fontWeight: "bold"
                    },
                },
            ]
        }
    }
});
const theme = DefaultTheme;

theme.typography.h1 = {
    [theme.breakpoints.up("sm")]: {
        fontSize: "2.8rem",
    }
}
theme.typography.h2 = {
    [theme.breakpoints.up("sm")]: {
        fontSize: "1.8rem",
    }
}
theme.typography.h3 = {
    [theme.breakpoints.up("sm")]: {
        fontSize: "1.5rem",
    }
}

// Apply response font sizing to Typography components
// DefaultTheme = responsiveFontSizes(DefaultTheme, { factor: 4, variants: ["h1"] });

export default DefaultTheme;