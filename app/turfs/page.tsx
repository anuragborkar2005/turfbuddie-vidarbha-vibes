"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, easeInOut } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { BookingFlow } from "@/components/booking/booking-flow"; // ⬅️ update path as needed
import type { Turf, TimeSlot, Booking } from "@/lib/types/booking";
import { DateSelector } from "@/components/date-selecctor";

// Helper to build a mock turf if you’re not fetching from API yet.
// Replace with real data from your backend/loader.
function buildMockTurf(): Turf {
  const slots: TimeSlot[] = [
    {
      id: "t1",
      startTime: "07:00",
      endTime: "08:00",
      isAvailable: true,
      price: 800,
    },
    {
      id: "t2",
      startTime: "08:00",
      endTime: "09:00",
      isAvailable: true,
      price: 800,
    },
    {
      id: "t3",
      startTime: "09:00",
      endTime: "10:00",
      isAvailable: false,
      price: 800,
    },
    {
      id: "t4",
      startTime: "15:00",
      endTime: "16:00",
      isAvailable: true,
      price: 900,
    },
    {
      id: "t5",
      startTime: "16:00",
      endTime: "17:00",
      isAvailable: false,
      price: 900,
    },
    {
      id: "t6",
      startTime: "17:00",
      endTime: "18:00",
      isAvailable: true,
      price: 900,
    },
    {
      id: "t7",
      startTime: "18:00",
      endTime: "19:00",
      isAvailable: false,
      price: 1000,
    },
    {
      id: "t8",
      startTime: "19:00",
      endTime: "20:00",
      isAvailable: true,
      price: 1000,
    },
  ];

  // Ensure your Turf type includes these fields. If it requires more, add them here.
  return {
    id: "turf_elite_arena",
    name: "Elite Turf Arena",
    address: "123 Sports Avenue, Andheri West, Mumbai",
    rating: 4.8,
    price: 800,
    timeSlots: slots,
  } as Turf;
}

// Format to YYYY-MM-DD for native date input
function todayISO(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export default function TurfDetails() {
  const router = useRouter();
  const turf = useMemo(() => buildMockTurf(), []);
  const [selectedDate, setSelectedDate] = useState<string>(todayISO());

  const handleBookingComplete = (booking: Booking) => {
    // Optional: route to a confirmation page or bookings list
    // router.push(`/bookings/${booking.id}`);
    console.log("Booking complete:", booking);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black  to-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Left: Immersive image */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: easeInOut }}
            className="relative h-[60vh] md:h-[90vh] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
          >
            <Image
              src="https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e"
              alt="Turf"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/0" />
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white/90 hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 transition"
            >
              <ArrowLeft size={16} aria-hidden="true" /> Back
            </button>

            {/* Optional tag */}
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/90 backdrop-blur-sm ring-1 ring-white/15">
                Elite Turf Arena • Andheri West
              </div>
            </div>
          </motion.div>

          {/* Right: Date selector + BookingFlow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: easeInOut }}
            className="md:sticky md:top-6 max-h-[90vh] overflow-auto hide-scrollbar bg-gray-900/60 backdrop-blur-sm rounded-2xl shadow-xl ring-1 ring-white/10 p-6 space-y-6"
          >
            {/* Simple date picker controlling BookingFlow */}

            <DateSelector
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            {/* Your BookingFlow component */}
            <BookingFlow
              turf={turf}
              selectedDate={selectedDate}
              onBookingComplete={handleBookingComplete}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
