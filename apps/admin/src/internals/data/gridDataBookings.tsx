import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { GridCellParams, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import dayjs from "dayjs";
import { Button } from "@mui/material";
import { useState, useCallback } from "react";

import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import MenuList from "@mui/material/MenuList";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import MenuItem, { menuItemClasses } from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGeneralContext } from "@/hooks/GeneralHooks";

// import { Label } from "src/components/label";

type Status = "pending" | "confirmed" | "completed" | "cancelled";

const actionButtons = [
  {
    status: "pending",
    label: "Pending",
    icon: "",
    sx: {},
  },
  {
    status: "confirmed",
    label: "Confirm",
    icon: "",
    sx: {},
  },
  {
    status: "completed",
    label: "Complete",
    icon: "",
    sx: {},
  },
  {
    status: "cancelled",
    label: "Cancel",
    icon: "",
    sx: { color: "error.main" },
  },
];

function renderStatus(status: Status) {
  const colors: {
    [index: string]:
      | "default"
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning";
  } = {
    pending: "default",
    confirmed: "success",
    completed: "info",
    cancelled: "error",
  };

  return <Chip label={status} color={colors[status]} size="small" />;
}

export function renderAvatar(
  params: GridCellParams<{ name: string; color: string }, unknown, unknown>
) {
  if (
    params.value == null ||
    typeof params.value !== "object" ||
    !("name" in params.value) ||
    !("color" in params.value)
  ) {
    return "";
  }

  const avatarValue = params.value as { name: string; color: string };
  return (
    <Avatar
      sx={{
        backgroundColor: avatarValue.color,
        width: "24px",
        height: "24px",
        fontSize: "0.85rem",
      }}
    >
      {avatarValue.name.toUpperCase().substring(0, 1)}
    </Avatar>
  );
}

const renderActionButton = (rowId: string, rowStatus: string) => {
  const queryClient = useQueryClient();
  const { user, showSnackbar } = useGeneralContext();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(
    null
  );

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpenPopover(event.currentTarget);
    },
    []
  );

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ status, id }: { status: string; id: string }) => {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "X-Api-Key": `${process.env.NEXT_PUBLIC_API_KEY}`,
          },
        }
      );
    },
    onSuccess: async () => {
      handleClosePopover();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin_bookings"] }),
        queryClient.invalidateQueries({ queryKey: ["audit"] }),
      ]);
      showSnackbar("Booking updated successfully", "success");
    },
    onError: (error) => {
      console.error(error);
      showSnackbar("You cant update the booking", "error");
    },
  });

  return (
    <>
      <IconButton onClick={handleOpenPopover}>
        <MoreVertIcon />
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: "flex",
            flexDirection: "column",
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: "action.selected" },
            },
          }}
        >
          {actionButtons.map((v) => (
            <MenuItem
              disabled={v.status === rowStatus || rowStatus === "cancelled"}
              key={v.status}
              onClick={() => {
                mutate({ status: v.status, id: rowId });
              }}
              sx={v.sx}
            >
              {v.icon && <EditIcon />}
              {v.label}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  );
};

export const columns: GridColDef[] = [
  {
    field: "service",
    headerName: "Bookings",
    flex: 1,
    minWidth: 200,
    valueGetter: (d: any) => d?.name || "",
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    minWidth: 80,
    renderCell: (params) => renderStatus(params.value as Status),
  },
  {
    field: "customer",
    headerName: "Customer Name",
    flex: 1,
    minWidth: 80,
    valueGetter: (d: any) => d?.name || "",
  },
  {
    field: "scheduled_at",
    headerName: "Scheduled At",
    flex: 1,
    minWidth: 100,
    valueGetter: (d: any) => dayjs(d).format("MMM DD, YYYY h:mm A"),
  },
  {
    field: "id",
    headerName: "Action",
    renderCell: (d) => renderActionButton(d.value, d.row.status),
  },
];
