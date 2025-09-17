import React from "react";
import Hero from "@/app/components/Home/Hero";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "KB Barbershop",
};

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}
