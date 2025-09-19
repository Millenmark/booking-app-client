"use client";

import * as React from "react";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "@/components/AppNavbar";
import Header from "@/components/Header";
import MainGrid from "@/components/MainGrid";
import SideMenu from "@/components/SideMenu";
import AppTheme from "@/theme/AppTheme";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { GeneralProvider } from "@/context/GeneralContext";
import { useGeneralContext } from "@/hooks/GeneralHooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <GeneralProvider>
        <AppTheme>
          <CssBaseline enableColorScheme />
          <Box sx={{ display: "flex" }}>
            <SideMenu />
            <AppNavbar />
            {/* Main content */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                backgroundColor: "var(--template-palette-background-default)",
                overflow: "auto",
              }}
            >
              <Stack
                spacing={2}
                sx={{
                  alignItems: "center",
                  mx: 3,
                  pb: 5,
                  mt: { xs: 8, md: 0 },
                }}
              >
                <Header />
                <MainGrid />
              </Stack>
            </Box>
          </Box>
        </AppTheme>
        <GlobalSnackbar />
      </GeneralProvider>
    </QueryClientProvider>
  );
}

function GlobalSnackbar() {
  const { snackbar, handleClose } = useGeneralContext();

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={snackbar.severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}
