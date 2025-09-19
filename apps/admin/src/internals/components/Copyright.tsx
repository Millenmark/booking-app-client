import * as React from "react";
import Link from "@mui/material/Link";
import { TypographyProps } from "@mui/material/Typography";
import Typography from "@mui/material/Typography";

export default function Copyright(props: TypographyProps) {
  return (
    <Typography
      variant="body2"
      align="center"
      {...props}
      sx={[
        {
          color: "text.secondary",
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        KB Barbershop
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
