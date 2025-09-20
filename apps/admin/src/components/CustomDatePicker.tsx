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
import { Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
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

const presets = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 days", value: "last7days" },
  { label: "Custom", value: "custom" },
];

export default function CustomDatePicker() {
  const { dateRange, setDateRange } = useGeneralContext();
  const [selectedPreset, setSelectedPreset] = useState<string>("custom");

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    const today = dayjs();
    let newRange: DateRange<Dayjs>;

    switch (preset) {
      case "yesterday":
        const yesterday = today.subtract(1, "day");
        newRange = [yesterday, yesterday];
        break;
      case "last7days":
        newRange = [today.subtract(7, "day"), today];
        break;
      case "custom":
        newRange = dateRange;
        break;
      case "today":
      default:
        newRange = [today, today];
        break;
    }
    setDateRange(newRange);
  };

  useEffect(() => {
    console.log(dateRange);
  }, [dateRange]);

  const getButtonLabel = () => {
    if (selectedPreset !== "custom") {
      return presets.find((p) => p.value === selectedPreset)?.label;
    }
    return undefined; // Let ButtonField show the date range
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", gap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Range</InputLabel>
          <Select
            value={selectedPreset}
            label="Range"
            onChange={(e) => handlePresetChange(e.target.value)}
          >
            {presets.map((preset) => (
              <MenuItem key={preset.value} value={preset.value}>
                {preset.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedPreset === "custom" && (
          <Box sx={{ position: "relative" }}>
            <DateRangePicker
              label={getButtonLabel()}
              value={dateRange}
              onChange={(newValue) => {
                setDateRange(newValue);
                if (selectedPreset !== "custom") {
                  setSelectedPreset("custom");
                }
              }}
              slots={{ field: ButtonField }}
              slotProps={{
                nextIconButton: { size: "small" },
                previousIconButton: { size: "small" },
              }}
            />
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
}
