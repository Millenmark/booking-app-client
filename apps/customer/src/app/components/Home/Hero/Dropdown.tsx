"use client";

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
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

export const Dropdown = () => {
  const queryClient = useQueryClient();
  const { user, setIsLogInOpen, services, showSnackbar } = useGeneralContext();
  const [selectedServiceId, setSelectedServiceId] = useState<number>(1);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [dateError, setDateError] = useState<string>("");

  const now = dayjs();
  const startOfMonth = now.startOf("month");
  const endOfMonth = now.add(30, "day").endOf("day");
  const minDate = now.isBefore(startOfMonth)
    ? startOfMonth
    : now.startOf("day");

  const handleChange = (
    event: SelectChangeEvent<number>,
    _child: React.ReactNode
  ) => {
    const value = event.target.value as number;
    setSelectedServiceId(value);
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
    if (services.length > 0) {
      setSelectedServiceId(services[0].id);
    }
  }, [services]);

  type BookingVariables = {
    selectedServiceId: number;
    date: string | null;
  };

  const { mutate } = useMutation<
    { message: string },
    AxiosError<{ message: string }>,
    BookingVariables
  >({
    mutationFn: async ({ selectedServiceId, date }) => {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
        { service_id: selectedServiceId, scheduled_at: date },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "X-Api-Key": `${process.env.NEXT_PUBLIC_API_KEY}`,
          },
        }
      );
      return data;
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Booking failed";
      showSnackbar(message, "error");
      console.error(message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      showSnackbar(data.message, "success");
    },
  });

  return (
    <div className="mx-auto max-w-4xl mt-12 p-6 lg:max-w-4xl lg:px-8 bg-white rounded-lg shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]">
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-8 xl:gap-x-8">
        <div className="col-span-3">
          <div className="w-full">
            <FormControl fullWidth>
              <InputLabel id="service">Select a Service</InputLabel>
              <Select<number>
                required
                labelId="service"
                id="service"
                value={selectedServiceId}
                label="Select a Service"
                onChange={handleChange}
              >
                <MenuItem disabled value="">
                  <em>Services</em>
                </MenuItem>
                {services.map((value) => (
                  <MenuItem key={value.id} value={value.id}>
                    {value.name} ₱{value.price}
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
                onChange={(newValue) => {
                  setDate(newValue ?? null);
                  if (dateError) setDateError("");
                }}
                format="MMM DD, YYYY at h:mm A"
                minDate={minDate}
                maxDate={endOfMonth}
                shouldDisableTime={shouldDisableTime}
                slotProps={{
                  textField: {
                    className:
                      "border-none outline-none focus:border-0 focus:outline-none w-100",
                    required: true,
                    error: !!dateError,
                    helperText: dateError,
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="col-span-3 sm:col-span-2 mt-2">
          <button
            onClick={() => {
              if (!user) {
                setIsLogInOpen(true);
                return;
              }
              if (!date) {
                setDateError("Please select a date and time");
                return;
              }
              const scheduledAt = date.format("YYYY-MM-DDTHH:mm:ss");
              mutate({ selectedServiceId, date: scheduledAt });
            }}
            className="bg-primary w-full hover:bg-transparent hover:text-primary duration-300 border border-primary text-white font-bold py-4 px-3 rounded-sm hover:cursor-pointer"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};
