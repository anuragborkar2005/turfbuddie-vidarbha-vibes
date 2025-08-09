"use client";

import Image from "next/image";
import { motion, easeInOut } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { BookingFlow } from "@/components/booking/booking-flow";
import { DateSelector } from "@/components/date-selector";
import { Turf } from "@/lib/types/booking";

interface TurfDetailsClientProps {
  turf: Turf;
  localDate: string;
}

export default function TurfDetailsClient({
  turf,
  localDate,
}: TurfDetailsClientProps) {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: easeInOut }}
          className="relative h-[60vh] md:h-[90vh] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
        >
          <Image
            src={turf.image}
            alt={turf.name}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/0" />
          <button
            type="button"
            onClick={() => history.back()}
            aria-label="Go back"
            className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white/90 hover:bg-black/70 transition"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Back
          </button>
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/90 backdrop-blur-sm ring-1 ring-white/15">
              {turf.name} • {turf.address}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: easeInOut }}
          className="md:sticky md:top-6 max-h-[90vh] overflow-auto hide-scrollbar bg-gray-900/60 backdrop-blur-sm rounded-2xl shadow-xl ring-1 ring-white/10 p-6 space-y-6"
        >
          <DateSelector selectedDate={localDate} setSelectedDate={() => {}} />
          <BookingFlow
            turf={turf}
            selectedDate={localDate}
            onBookingComplete={(booking) =>
              console.log("Booking complete:", booking)
            }
          />
        </motion.div>
      </div>
    </div>
  );
}
