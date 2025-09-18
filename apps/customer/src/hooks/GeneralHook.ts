import { useContext } from "react";
import { GeneralContext } from "@/context/GeneralContext";

export const useGeneralContext = () => {
  const context = useContext(GeneralContext);
  if (!context) {
    throw new Error("No context");
  }
  return context;
};
