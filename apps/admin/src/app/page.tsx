import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "Admin Dashboard - KB Barbershop",
  description: "Created by Millen Mark Aquino",
};

export default function Home() {
  return (
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
  );
}
