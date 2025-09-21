"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import { useServiceAnalytics } from "@/hooks/useServiceAnalytics";

export default function TopServicesChart() {
  const theme = useTheme();
  const colorPalette = [
    (theme.vars || theme).palette.primary.dark,
    (theme.vars || theme).palette.primary.main,
    (theme.vars || theme).palette.primary.light,
  ];

  const [dateFilter, setDateFilter] = useState({
    date_from: dayjs().format("YYYY-MM-DD"),
    date_to: dayjs().format("YYYY-MM-DD"),
  });

  const { mutate, data } = useServiceAnalytics();

  useLayoutEffect(() => {
    mutate(dateFilter);
  }, []);

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Top services by booking count
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* <Typography variant="h4" component="p">
              1.3M
            </Typography>
            <Chip size="small" color="error" label="-8%" /> */}
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Most services booked this month
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: "band",
              categoryGapRatio: 0.5,
              data: Object.keys(data?.top_services ?? {}),
              height: 24,
            },
          ]}
          yAxis={[{ width: 50 }]}
          series={[
            // {
            //   id: "page-views",
            //   label: "Page views",
            //   data: [2234, 3872, 2998, 4125, 3357, 2789, 2998],
            //   stack: "A",
            // },
            // {
            //   id: "downloads",
            //   label: "Downloads",
            //   data: [3098, 4215, 2384, 2101, 4752, 3593, 2384],
            //   stack: "A",
            // },
            {
              id: "conversions",
              label: "Total",
              data: Object.values(data?.top_services ?? {}),
              stack: "A",
            },
          ]}
          height={250}
          margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
          grid={{ horizontal: true }}
          hideLegend
        />
      </CardContent>
    </Card>
  );
}
