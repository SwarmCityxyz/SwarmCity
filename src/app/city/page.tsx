import type { Metadata } from "next";
import { CityMap } from "@/components/city/CityMap";

export const metadata: Metadata = {
  title: "The living city",
  description: "A miniature, explorable Swarm City: five districts, sample citizens at work, and a City Director that changes the weather and the hour.",
};

export default function CityPage() {
  return <CityMap />;
}
