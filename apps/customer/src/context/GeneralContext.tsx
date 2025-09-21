"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

interface IUser {
  name: string;
  token: string;
}

type GeneralContextValue = {
  user: IUser | null;
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  setIsLogInOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRegisterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  services: {
    id: number;
    name: string;
    description: string;
    price: string;
    duration_minutes: number;
  }[];
  snackbar: { open: boolean; message: string; severity: "success" | "error" };
  showSnackbar: (message: string, severity: "success" | "error") => void;
  handleClose: (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => void;
};

export const GeneralContext = createContext<GeneralContextValue | undefined>(
  undefined
);

export const GeneralProvider = ({ children }: { children: ReactNode }) => {
  const [isLoginOpen, setIsLogInOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const queryClient = useQueryClient();

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    queryClient
      .prefetchQuery({
        queryKey: ["services"],
        queryFn: async () => {
          const {
            data: { data },
          } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/services`,
            {
              headers: {
                "X-Api-Key": `${process.env.NEXT_PUBLIC_API_KEY}`,
              },
            }
          );

          return data;
        },
      })
      .then(() => {
        const cached = queryClient.getQueryData<any[]>(["services"]);
        if (cached) {
          setServices(cached);
        }
      });
  }, [queryClient]);

  useEffect(() => {
    if (!user) {
      const localUser = localStorage.getItem("user");
      if (localUser) setUser(JSON.parse(localUser));
    }
  }, []);

  return (
    <GeneralContext.Provider
      value={{
        isLoginOpen,
        isRegisterOpen,
        setIsLogInOpen,
        setIsRegisterOpen,
        user,
        setUser,
        services,
        snackbar,
        showSnackbar,
        handleClose,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};
