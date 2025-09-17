"use client";

import { createContext, useState, ReactNode, useEffect } from "react";

type GeneralContextValue = {
  isSignInOpen: boolean;
  isSignUpOpen: boolean;
  setIsSignInOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSignUpOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GeneralContext = createContext<GeneralContextValue | undefined>(
  undefined
);

export const GeneralProvider = ({ children }: { children: ReactNode }) => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <GeneralContext.Provider
      value={{ isSignInOpen, isSignUpOpen, setIsSignInOpen, setIsSignUpOpen }}
    >
      {children}
    </GeneralContext.Provider>
  );
};
