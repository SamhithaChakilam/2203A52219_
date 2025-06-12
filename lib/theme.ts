import { createTheme } from "@mui/material/styles"

// Futuristic dark theme with neon accents
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00ffff", // Neon cyan
      light: "#64ffff",
      dark: "#00b2b2",
    },
    secondary: {
      main: "#ff0080", // Neon pink
      light: "#ff5aa6",
      dark: "#b20059",
    },
    error: {
      main: "#ff4444",
    },
    warning: {
      main: "#ffaa00",
    },
    info: {
      main: "#0099ff",
    },
    success: {
      main: "#00ff88",
    },
    background: {
      default: "#0a0a0f",
      paper: "rgba(15, 15, 25, 0.8)",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
  },
  typography: {
    fontFamily: ["var(--font-orbitron)", "var(--font-roboto-mono)", "monospace"].join(","),
    h1: {
      fontWeight: 700,
      letterSpacing: "0.1em",
    },
    h2: {
      fontWeight: 600,
      letterSpacing: "0.08em",
    },
    h4: {
      fontWeight: 600,
      letterSpacing: "0.05em",
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.1em",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "uppercase",
          borderRadius: "8px",
          padding: "12px 24px",
          background: "linear-gradient(45deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 128, 0.1))",
          border: "1px solid rgba(0, 255, 255, 0.3)",
          backdropFilter: "blur(10px)",
          transition: "all 0.3s ease",
          "&:hover": {
            background: "linear-gradient(45deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 128, 0.2))",
            border: "1px solid rgba(0, 255, 255, 0.6)",
            boxShadow: "0 0 20px rgba(0, 255, 255, 0.4)",
            transform: "translateY(-2px)",
          },
        },
        contained: {
          background: "linear-gradient(45deg, #00ffff, #ff0080)",
          color: "#000",
          "&:hover": {
            background: "linear-gradient(45deg, #64ffff, #ff5aa6)",
            boxShadow: "0 0 30px rgba(0, 255, 255, 0.6)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "rgba(15, 15, 25, 0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0, 255, 255, 0.2)",
          borderRadius: "16px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(10, 10, 15, 0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0, 255, 255, 0.3)",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 255, 255, 0.3)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 255, 255, 0.6)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#00ffff",
            boxShadow: "0 0 10px rgba(0, 255, 255, 0.3)",
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: "#00ffff",
          "& .MuiSlider-thumb": {
            background: "linear-gradient(45deg, #00ffff, #ff0080)",
            boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)",
            "&:hover": {
              boxShadow: "0 0 25px rgba(0, 255, 255, 0.8)",
            },
          },
          "& .MuiSlider-track": {
            background: "linear-gradient(90deg, #00ffff, #ff0080)",
          },
          "& .MuiSlider-rail": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
  },
})

export default theme
