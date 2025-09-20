"use client";

import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useForkRef } from "@mui/material/utils";
import Button from "@mui/material/Button";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRange } from "@mui/x-date-pickers-pro/models";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { usePickerContext } from "@mui/x-date-pickers";
import { Box } from "@mui/material";
import { useGeneralContext } from "@/hooks/GeneralHooks";

function ButtonField() {
  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const value = pickerContext.value as unknown as DateRange<Dayjs>;
  const valueStr =
    value == null || value[0] == null || value[1] == null
      ? "Select dates"
      : `${value[0].format("MMM DD, YYYY")} - ${value[1].format(
          "MMM DD, YYYY"
        )}`;

  return (
    <Button
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

export default function CustomDatePicker() {
  const { dateRange, setDateRange } = useGeneralContext();

  useEffect(() => {
    console.log(dateRange);
  }, [dateRange]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ position: "relative" }}>
        <DateRangePicker
          value={dateRange}
          onChange={(newValue) => setDateRange(newValue)}
          slots={{ field: ButtonField }}
          slotProps={{
            nextIconButton: { size: "small" },
            previousIconButton: { size: "small" },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}
