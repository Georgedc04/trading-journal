"use client";
import { motion } from "framer-motion";
import TradeCalendarPro from "@/components/TradeCalendar";

export default function CalendarSection({
  trades,
  accountSize,
}: {
  trades: any[];
  accountSize: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-5xl mx-auto"
    >
      <TradeCalendarPro trades={trades} accountSize={accountSize} />
    </motion.section>
  );
}
