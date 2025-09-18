"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Layout/Header";
import ScrollToTop from "@/app/components/ScrollToTop";
import Aoscompo from "@/utils/aos";
import { GeneralProvider } from "@/context/GeneralContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useGeneralContext } from "@/hooks/GeneralHook";
const font = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className}`}>
        <QueryClientProvider client={queryClient}>
          <GeneralProvider>
            <Aoscompo>
              <Toaster />
              <Header />
              {children}
            </Aoscompo>
            <GlobalSnackbar />
            <ScrollToTop />
          </GeneralProvider>
        </QueryClientProvider>
      </body>
    </html>
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
