import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Copyright from "../internals/components/Copyright";
import ChartUserByCountry from "./ChartUserByCountry";
import CustomizedTreeView from "./CustomizedTreeView";
import BookingsDataGrid from "./BookingsDataGrid";
import ActivityLogDataGrid from "./ActivityLogDataGrid";
import HighlightedCard from "./HighlightedCard";
import TopServicesChart from "./TopServicesChart";
import BookingsOverTimeChart from "./BookingsOverTimeChart";
import RevenueOverTimeChart from "./RevenueOverTimeChart";
import StatCard, { StatCardProps } from "./StatCard";
import ActivityLogTable from "./ActivityLogTable";
import { useGeneralContext } from "@/hooks/GeneralHooks";
import { useBookingsAnalytics } from "@/hooks/useBookingsAnalytics";
import { useRevenueAnalytics } from "@/hooks/useRevenueAnalytics";
import dayjs from "dayjs";

export default function MainGrid() {
  const { dateRange } = useGeneralContext();

  const { mutate: mutateBookingsAnalytics, data: bookingsAnalytics } =
    useBookingsAnalytics();
  const { mutate: mutateRevenueAnalytics, data: revenueAnalytics } =
    useRevenueAnalytics();

  useEffect(() => {
    mutateBookingsAnalytics({
      date_from:
        dateRange[0]?.format("YYYY-MM-DD") ?? dayjs().format("YYYY-MM-DD"),
      date_to:
        dateRange[1]?.format("YYYY-MM-DD") ?? dayjs().format("YYYY-MM-DD"),
    });
    mutateRevenueAnalytics({
      date_from:
        dateRange[0]?.format("YYYY-MM-DD") ?? dayjs().format("YYYY-MM-DD"),
      date_to:
        dateRange[1]?.format("YYYY-MM-DD") ?? dayjs().format("YYYY-MM-DD"),
    });
  }, [dateRange]);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* cards */}
      <Typography
        component="h2"
        variant="h6"
        sx={{ mb: "var(--template-spacing-2)" }}
      >
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: "var(--template-spacing-2)" }}
      >
        {/* BOOKINGS */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Bookings"
            interval=""
            trend="up"
            value={`${bookingsAnalytics?.total ?? 0}`}
          />
        </Grid>

        {/* CASH REVENUE */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Cash Revenue"
            interval=""
            trend="up"
            value={`₱${revenueAnalytics?.total ?? 0}`}
          />
        </Grid>

        {/* UNPAID BOOKINGS */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Unpaid Bookings"
            interval=""
            trend="up"
            value={`${bookingsAnalytics?.unpaid ?? 0}`}
          />
        </Grid>

        {/* PAYMENT CONVERSIONS */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Payment Conversions"
            interval=""
            trend="up"
            value={`${bookingsAnalytics?.conversion_rate ?? 0}%`}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <BookingsOverTimeChart dataY={bookingsAnalytics?.daily ?? []} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TopServicesChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <RevenueOverTimeChart dataY={revenueAnalytics?.daily ?? []} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={{ height: 330 }}>
          <ActivityLogDataGrid />
        </Grid>
      </Grid>
      {/* <Typography
        component="h2"
        variant="h6"
        sx={{ mb: "var(--template-spacing-2)" }}
      >
        Bookings
      </Typography> */}
      <Grid container spacing={2} columns={12} sx={{ mt: "2rem" }}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <BookingsDataGrid />
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
