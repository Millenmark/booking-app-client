import type { Metadata } from "next";
import DashboardClient from "@/components/DashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard - KB Barbershop",
  description: "Created by Millen Mark Aquino",
};

export default function Home() {
  return <DashboardClient />;
}
