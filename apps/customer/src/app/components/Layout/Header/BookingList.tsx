import { useState, useRef, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { useQuery } from "@tanstack/react-query";
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
  const { user } = useGeneralContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  return (
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
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </div>
  );
}
