"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ReactNode } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface ServicesPreloaderProps {
  children: ReactNode;
}

export default function ServicesPreloader({
  children,
}: ServicesPreloaderProps) {
  const { isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const {
        data: { data },
      } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/services`, {
        headers: {
          "X-Api-Key": `${process.env.NEXT_PUBLIC_API_KEY}`,
        },
      });

      return data;
    },
  });

  return (
    <>
      <Backdrop
        open={isLoading}
        sx={{
          backgroundColor: "#FCF6EF",
          color: "black",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <svg
            version="1.1"
            id="L2"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            enableBackground="new 0 0 100 100"
            xmlSpace="preserve"
            width="60"
            height="60"
          >
            <circle
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeMiterlimit="10"
              cx="50"
              cy="50"
              r="48"
            />
            <line
              fill="none"
              strokeLinecap="round"
              stroke="currentColor"
              strokeWidth="4"
              strokeMiterlimit="10"
              x1="50"
              y1="50"
              x2="85"
              y2="50.5"
            >
              <animateTransform
                attributeName="transform"
                dur="2s"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                repeatCount="indefinite"
              />
            </line>
            <line
              fill="none"
              strokeLinecap="round"
              stroke="currentColor"
              strokeWidth="4"
              strokeMiterlimit="10"
              x1="50"
              y1="50"
              x2="49.5"
              y2="74"
            >
              <animateTransform
                attributeName="transform"
                dur="15s"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                repeatCount="indefinite"
              />
            </line>
          </svg>
          <Typography variant="h6" color="inherit">
            Getting the services you need ready
          </Typography>
        </Box>
      </Backdrop>
      {!isLoading && children}
    </>
  );
}
