"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useGeneralContext } from "./GeneralHooks";

type Filters = {
  date_from: string;
  date_to: string;
};

export function useRevenueAnalytics() {
  const { user } = useGeneralContext();

  return useMutation({
    mutationFn: async (filters: Filters) => {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/revenue-analytics`,
        filters,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      return data;
    },
  });
}
