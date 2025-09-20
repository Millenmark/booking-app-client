"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GeneralProvider } from "@/context/GeneralContext";
import { useGeneralContext } from "@/hooks/GeneralHooks";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const queryClient = new QueryClient();

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

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <GeneralProvider>
        {children}
        <GlobalSnackbar />
      </GeneralProvider>
    </QueryClientProvider>
  );
}
