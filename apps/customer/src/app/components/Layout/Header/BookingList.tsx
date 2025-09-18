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
import ScheduleIcon from "@mui/icons-material/Schedule";
import CancelIcon from "@mui/icons-material/Cancel";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useGeneralContext } from "@/hooks/GeneralHook";
import dayjs from "dayjs";
import axios from "axios";

interface IBooking {
  id: number;
  name: string;
  price: string;
  schedule: string;
}

export default function BookingList() {
  const { user, showSnackbar } = useGeneralContext();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: bookings = [] } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const {
        data: { data },
      } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      return data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (bookingId: number) => {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`,
        {
          status: "cancelled",
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
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
      console.error(message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      showSnackbar("Booking is already cancelled", "success");
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
              {bookings.map((booking: IBooking) => (
                <ListItem key={booking.id}>
                  <ListItemAvatar>
                    <Avatar>
                      <ScheduleIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={booking.name}
                    secondary={`${dayjs(booking.schedule).format(
                      "MMM D, YYYY h:mmA"
                    )}`}
                  />
                  <IconButton
                    edge="end"
                    aria-label="cancel"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelClick(booking);
                    }}
                  >
                    <CancelIcon />
                  </IconButton>
                </ListItem>
              ))}
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
    </>
  );
}
