"use client";

import { createContext, useState, ReactNode, useEffect } from "react";

type GeneralContextValue = {
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  setIsLogInOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRegisterOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GeneralContext = createContext<GeneralContextValue | undefined>(
  undefined
);

export const GeneralProvider = ({ children }: { children: ReactNode }) => {
  const [isLoginOpen, setIsLogInOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <GeneralContext.Provider
      value={{ isLoginOpen, isRegisterOpen, setIsLogInOpen, setIsRegisterOpen }}
    >
      {children}
    </GeneralContext.Provider>
  );
};
