"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, easeInOut } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { BookingFlow } from "@/components/booking/booking-flow";
import type { Turf, Booking } from "@/lib/types/booking";
import { DateSelector } from "@/components/date-selector";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface TurfPageProps {
  params: {
    id: string;
  };
}

// Helper to map Firestore timeSlots to expected format
interface RawTimeSlot {
 timeSlot?: string;
 status?: string;
 price?: number;
}

function formatTimeSlots(rawTimeSlots: RawTimeSlot[]): Turf["timeSlots"] {
  return rawTimeSlots.map((slot, idx) => ({
    // Use optional chaining and provide default values in case properties are missing
    // Although the prompt specifically asks to replace `any`, ensuring robustness for potentially incomplete data is good practice.
    // The primary change here is defining the shape of `RawTimeSlot`.
    id: `slot_${idx}`,
    startTime: slot.timeSlot?.split(" - ")[0] || "00:00",
    endTime: slot.timeSlot?.split(" - ")[1] || "01:00",
    isAvailable: slot.status !== "confirmed",
    price: slot.price || 499,
  }));
}

export default function TurfDetailsPage({ params }: TurfPageProps) {
  const router = useRouter();
  // Reverted to direct access to resolve TypeScript errors.
  // The console warning is for a future Next.js version and can be addressed later.
  const turfId = params.id;
  
  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    setHasMounted(true);
    const d = new Date();
    const off = d.getTimezoneOffset();
    const local = new Date(d.getTime() - off * 60 * 1000);
    setSelectedDate(local.toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    if (!turfId) return;

    async function fetchTurf() {
      setLoading(true);
      try {
        const docRef = doc(db, "Turfs", turfId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const locationData = data.location;
          const createdAtData = data.createdAt;
          
          setTurf({
            id: turfId,
            name: data.name || "",
            address: data.address || "",
            image: data.imageurl || "",
            rating: data.rating || 0,
            price: data.price || 0,
            timeSlots: formatTimeSlots(data.timeSlots || []),
            amenities: data.amenities || [],
            description: data.description || "",
            location: locationData
              ? { lat: locationData.latitude, lng: locationData.longitude }
              : { lat: 0, lng: 0 },
            ownerId: data.ownerId || "",
            createdAt: createdAtData ? createdAtData.toDate() : new Date(0),
          });
        } else {
          console.error("No turf found with ID:", turfId);
        }
      } catch (error) {
        console.error("Error fetching turf:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTurf();
  }, [turfId]);

  const handleBookingComplete = (booking: Booking) => {
    console.log("Booking complete:", booking);
  };

  if (!hasMounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading turf details...
      </div>
    );
  }

  if (!turf) {
     return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Turf not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black  to-gray-900 text-white">
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
              onClick={() => router.back()}
              aria-label="Go back"
              className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white/90 hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 transition"
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
            <DateSelector
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

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
