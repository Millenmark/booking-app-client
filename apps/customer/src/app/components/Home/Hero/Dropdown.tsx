"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useGeneralContext } from "@/hooks/GeneralHook";

export const Dropdown = () => {
  const { user, setIsLogInOpen, services } = useGeneralContext();
  const [service, setService] = useState<string>("");
  const [date, setDate] = useState<Dayjs | null>(null);

  const now = dayjs();
  const startOfMonth = now.startOf("month");
  const endOfMonth = now.endOf("month");
  const minDate = now.isBefore(startOfMonth)
    ? startOfMonth
    : now.startOf("day");

  const handleChange = (event: SelectChangeEvent) => {
    setService(event.target.value);
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

  useEffect(() => {
    console.log("service", service);
    console.log("date", date?.format("YYYY-MM-DDTHH:mm:ss"));
  }, [service, date]);

  useEffect(() => {
    if (services.length > 0) {
      setService(services[0].name);
    }
  }, [services]);

  return (
    <div className="mx-auto max-w-4xl mt-12 p-6 lg:max-w-4xl lg:px-8 bg-white rounded-lg shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]">
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-8 xl:gap-x-8">
        <div className="col-span-3">
          <div className="w-full">
            <FormControl fullWidth>
              <InputLabel id="service">Select a Service</InputLabel>
              <Select
                required
                labelId="service"
                id="service"
                value={service}
                label="Select a Service"
                onChange={handleChange}
              >
                <MenuItem disabled value="">
                  <em>Services</em>
                </MenuItem>
                {services.map((value) => (
                  <MenuItem key={value.id} value={value.name}>
                    {value.name} PHP: {value.price}
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
                value={date}
                onChange={(newValue) => setDate(newValue ?? null)}
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
            <button
              onClick={() => {
                if (!user) setIsLogInOpen(true);
              }}
              className="bg-primary w-full hover:bg-transparent hover:text-primary duration-300 border border-primary text-white font-bold py-4 px-3 rounded-sm hover:cursor-pointer"
            >
              Book Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
