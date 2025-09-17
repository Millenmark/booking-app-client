"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CourseType } from "@/app/types/course";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export const Dropdown = () => {
  const [course, setCourse] = useState<CourseType[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [value, setValue] = useState<Dayjs | null>();

  const now = dayjs();
  const startOfMonth = now.startOf("month");
  const endOfMonth = now.endOf("month");
  const minDate = now.isBefore(startOfMonth)
    ? startOfMonth
    : now.startOf("day");

  const handleChange = (event: SelectChangeEvent) => {
    setSelected(event.target.value);
  };

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
    <div className="mx-auto max-w-4xl mt-12 p-6 lg:max-w-4xl lg:px-8 bg-white rounded-lg shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]">
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-8 xl:gap-x-8">
        <div className="col-span-3">
          <div className="w-full">
            <FormControl fullWidth>
              <InputLabel id="service">Service</InputLabel>
              <Select
                labelId="service"
                id="service"
                value={selected || ""}
                label="Selectc a Service"
                onChange={handleChange}
              >
                {course.map((value) => (
                  <MenuItem key={value.name} value={value.name}>
                    {value.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="col-span-3">
          <div className="w-full">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                disablePast
                label="Select Date and Time"
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
                    required: true,
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="col-span-3 sm:col-span-2 mt-2">
          <Link href={"/#courses-section"}>
            <button className="bg-primary w-full hover:bg-transparent hover:text-primary duration-300 border border-primary text-white font-bold py-4 px-3 rounded-sm hover:cursor-pointer">
              Book Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
