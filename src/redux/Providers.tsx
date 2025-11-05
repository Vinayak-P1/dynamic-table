"use client";

import { useState, useMemo } from "react";
import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

import { store } from "./store";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const theme = useMemo(
    () => createTheme({ palette: { mode } }),
    [mode]
  );

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <button
          onClick={() => setMode(prev => (prev === "light" ? "dark" : "light"))}
          style={{
            position: "fixed",
            top: 10,
            right: 10,
            zIndex: 9999,
            border: "none",
            padding: "8px 12px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          {mode === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {children}
      </ThemeProvider>
    </Provider>
  );
}
