import { useState, useRef, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useGeneralContext } from "@/hooks/GeneralHook";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";

interface IBooking {
  id: number;
  name: string;
  price: string;
  schedule: string;
}

export default function BookingList() {
  const { user, showSnackbar, services } = useGeneralContext();
  const [isOpen, setIsOpen] = useState(false);
  const [dateError, setDateError] = useState<string>("");
  const now = dayjs();
  const startOfMonth = now.startOf("month");
  const endOfMonth = now.add(30, "day").endOf("day");
  const minDate = now.isBefore(startOfMonth)
    ? startOfMonth
    : now.startOf("day");
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBookingForEdit, setSelectedBookingForEdit] =
    useState<IBooking | null>(null);
  const [editForm, setEditForm] = useState({
    serviceType: 0,
    schedule: dayjs(),
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

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
    console.log("Data Form from", editForm);
  }, [editForm]);

  const { data: bookings = [] } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const {
        data: { data },
      } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "X-Api-Key": `${process.env.NEXT_PUBLIC_API_KEY}`,
        },
      });

      return data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (bookingId: number) => {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`,
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
      const message = axios.isAxiosError(error)
        ? (error.response?.data as any)?.message || "Cancellation failed"
        : "Cancellation failed";
      showSnackbar(message, "error");
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      showSnackbar("Booking is already cancelled", "success");
    },
  });

  const { mutate: updateMutate } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: { service_id: number; scheduled_at: string };
    }) => {
      const { data: response } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "X-Api-Key": `${process.env.NEXT_PUBLIC_API_KEY}`,
          },
        }
      );
      return response;
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as any)?.message || "Update failed"
        : "Update failed";
      showSnackbar(message, "error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      showSnackbar("Booking updated successfully", "success");
    },
  });

  // !!UNCOMMENT IF YOU WANT TO CLOSE THE LIST WHEN CLICKING OUTSIDE
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       dropdownRef.current &&
  //       !dropdownRef.current.contains(event.target as Node)
  //     ) {
  //       setIsOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const handleCancelClick = (booking: IBooking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (selectedBooking) {
      mutate(selectedBooking.id);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setIsModalOpen(false);
      setSelectedBooking(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleEditClick = (booking: IBooking) => {
    setSelectedBookingForEdit(booking);
    const selectedService = services.find((s) => s.name === booking.name);
    setEditForm({
      serviceType: selectedService ? selectedService.id : 0,
      schedule: dayjs(booking.schedule),
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBookingForEdit(null);
  };

  const handleUpdateBooking = () => {
    if (selectedBookingForEdit) {
      const selectedService = services.find(
        (s) => s.id === editForm.serviceType
      );
      if (selectedService) {
        updateMutate({
          id: selectedBookingForEdit.id,
          data: {
            service_id: editForm.serviceType,
            scheduled_at: editForm.schedule.format("YYYY-MM-DDTHH:mm:ss"),
          },
        });
        setIsEditModalOpen(false);
        setSelectedBookingForEdit(null);
      }
    }
  };

  return (
    <>
      <div ref={dropdownRef} style={{ position: "relative" }}>
        <IconButton onClick={() => setIsOpen(!isOpen)}>
          <img src="/bookings.svg" alt="Bookings" width={40} height={40} />
        </IconButton>
        {isOpen && (
          <Box
            sx={{
              position: "absolute",
              top: "100%",
              right: 0,
              width: 360,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              zIndex: 1000,
              maxHeight: 300,
              overflowY: "auto",
            }}
          >
            <List sx={{ width: "100%", maxWidth: 360 }}>
              {bookings.length !== 0 ? (
                bookings.map((booking: IBooking) => (
                  <ListItem key={booking.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <ScheduleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${booking.name} ₱${booking.price}`}
                      secondary={`${dayjs(booking.schedule).format(
                        "MMM D, YYYY h:mmA"
                      )}`}
                    />
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        aria-label="edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(booking);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="cancel"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelClick(booking);
                        }}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))
              ) : (
                <p className="text-center">No Bookings Yet</p>
              )}
            </List>
          </Box>
        )}
      </div>

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          Are you sure you want to cancel the booking for "
          {selectedBooking?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>No</Button>
          <Button
            onClick={handleConfirmCancel}
            color="error"
            variant="contained"
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditModalOpen} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <Select
            value={editForm.serviceType}
            onChange={(e) =>
              setEditForm({ ...editForm, serviceType: Number(e.target.value) })
            }
            fullWidth
            variant="standard"
            displayEmpty
            sx={{ marginBottom: 2, marginTop: 1 }}
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Schedule"
              value={editForm.schedule}
              onChange={(newValue) =>
                setEditForm({ ...editForm, schedule: newValue || dayjs() })
              }
              minDate={minDate}
              maxDate={endOfMonth}
              shouldDisableTime={shouldDisableTime}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "dense",
                  variant: "standard",
                  className:
                    "border-none outline-none focus:border-0 focus:outline-none w-100",
                  required: true,
                  error: !!dateError,
                  helperText: dateError,
                },
              }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancel</Button>
          <Button onClick={handleUpdateBooking} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
