"use client";

import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { useForkRef } from "@mui/material/utils";
import Button from "@mui/material/Button";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  DatePicker,
  DatePickerFieldProps,
} from "@mui/x-date-pickers/DatePicker";
import {
  useParsedFormat,
  usePickerContext,
  useSplitFieldProps,
} from "@mui/x-date-pickers";
import { Box, Typography } from "@mui/material";

function ButtonField(props: DatePickerFieldProps) {
  const { forwardedProps } = useSplitFieldProps(props, "date");
  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const parsedFormat = useParsedFormat();
  const valueStr =
    pickerContext.value == null
      ? parsedFormat
      : pickerContext.value.format(pickerContext.fieldFormat);

  return (
    <Button
      {...forwardedProps}
      variant="outlined"
      ref={handleRef}
      size="small"
      startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
      sx={{ minWidth: "fit-content" }}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    >
      {pickerContext.label ?? valueStr}
    </Button>
  );
}

export default function CustomDatePicker({
  isSecondary,
}: {
  isSecondary?: boolean;
}) {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs("2023-04-17"));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ position: "relative" }}>
        <DatePicker
          value={value}
          label={value == null ? null : value.format("MMM DD, YYYY")}
          onChange={(newValue) => setValue(newValue)}
          slots={{ field: ButtonField }}
          slotProps={{
            nextIconButton: { size: "small" },
            previousIconButton: { size: "small" },
          }}
          views={["day", "month", "year"]}
        />
        <Typography
          sx={{
            position: "absolute",
            bottom: "-1.25rem",
            left: 0,
          }}
        >
          {isSecondary ? "To" : "From"}
        </Typography>
      </Box>
    </LocalizationProvider>
  );
}
