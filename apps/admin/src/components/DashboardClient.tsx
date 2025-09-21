"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGeneralContext } from "@/hooks/GeneralHooks";
import { Box, Stack } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import AppNavbar from "@/components/AppNavbar";
import Header from "@/components/Header";
import MainGrid from "@/components/MainGrid";
import SideMenu from "@/components/SideMenu";
import AppTheme from "@/theme/AppTheme";

export default function DashboardClient() {
  const router = useRouter();
  const { user } = useGeneralContext();

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    }
  }, [user, router]);

  if (!user) {
    return null; // or a loading spinner
  }

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
