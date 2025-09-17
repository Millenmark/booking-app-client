"use client";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const Dropdown = () => {
  const [value, setValue] = useState<Dayjs | null>(dayjs());

  const now = dayjs();
  const startOfMonth = now.startOf("month");
  const endOfMonth = now.endOf("month");
  const minDate = now.isBefore(startOfMonth)
    ? startOfMonth
    : now.startOf("day");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/data");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchData();
  }, []);

  const shouldDisableTime = (value: Dayjs, view: string) => {
    if (view !== "hours") return false;

    const hour = value.hour();
    const selectedDate = value.startOf("day");
    const isToday = selectedDate.isSame(now, "day");

    if (isToday) {
      return hour < now.hour() || hour > 17;
    } else {
      return hour < 9 || hour > 17;
    }
  };

  return (
    <div className="w-full">
      <p className="text-lg text-gray-500">Select Date & Time</p>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          disablePast
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="MMM DD, YYYY at h:mm A"
          minDate={minDate}
          maxDate={endOfMonth}
          shouldDisableTime={shouldDisableTime}
          slotProps={{
            textField: {
              className:
                "border-none outline-none focus:border-0 focus:outline-none w-100",
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default Dropdown;
