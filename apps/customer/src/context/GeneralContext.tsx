"use client";

import { createContext, useState, ReactNode, useEffect } from "react";

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
};

export const GeneralContext = createContext<GeneralContextValue | undefined>(
  undefined
);

export const GeneralProvider = ({ children }: { children: ReactNode }) => {
  const [isLoginOpen, setIsLogInOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);

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
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};
