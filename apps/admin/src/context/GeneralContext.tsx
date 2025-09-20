"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { DateRange } from "@mui/x-date-pickers-pro/models";
import dayjs, { Dayjs } from "dayjs";

interface IUser {
  name: string;
  email: string;
  role: string;
  token: string;
}

type GeneralContextValue = {
  user: IUser | null;
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  setIsLogInOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRegisterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  snackbar: { open: boolean; message: string; severity: "success" | "error" };
  showSnackbar: (message: string, severity: "success" | "error") => void;
  handleClose: (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => void;
  dateRange: DateRange<Dayjs>;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange<Dayjs>>>;
};

export const GeneralContext = createContext<GeneralContextValue | undefined>(
  undefined
);

export const GeneralProvider = ({ children }: { children: ReactNode }) => {
  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([
    dayjs(),
    dayjs(),
  ]);
  const [isLoginOpen, setIsLogInOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

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
        snackbar,
        showSnackbar,
        handleClose,
        dateRange,
        setDateRange,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};
