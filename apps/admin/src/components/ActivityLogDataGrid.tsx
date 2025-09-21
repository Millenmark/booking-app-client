"use client";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { columns, rows } from "../internals/data/gridDataActivityLog";
import { useQuery } from "@tanstack/react-query";
import { useGeneralContext } from "@/hooks/GeneralHooks";
import axios from "axios";

export default function ActivityLogDataGrid() {
  const { user } = useGeneralContext();

  const { data } = useQuery({
    queryKey: ["audit"],
    queryFn: async () => {
      const {
        data: { data },
      } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/audit/booking-status`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "X-Api-Key": `${process.env.NEXT_PUBLIC_API_KEY}`,
          },
        }
      );
      return data;
    },
  });

  return (
    <DataGrid
      // checkboxSelection
      rows={data}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      // disableColumnResize
      density="compact"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: "outlined",
              size: "small",
            },
            columnInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            operatorInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: "outlined",
                size: "small",
              },
            },
          },
        },
      }}
    />
  );
}
