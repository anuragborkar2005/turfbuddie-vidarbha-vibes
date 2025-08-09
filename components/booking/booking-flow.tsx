"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Star } from "lucide-react";
import { Turf, TimeSlot, Booking } from "@/lib/types/booking";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-provider";
import { initiatePayment } from "@/lib/razorpay/payment";

interface BookingFlowProps {
  turf: Turf;
  selectedDate: string;
  onBookingComplete: (booking: Booking) => void;
}

export function BookingFlow({
  turf,
  selectedDate,
  onBookingComplete,
}: BookingFlowProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();

  // Derived display values for separated format
  const dateObj = new Date(selectedDate);

  const daySlot = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const monthSlotShort = dateObj.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });

  const monthSlotLongYear = dateObj.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleSlotSelection = (slot: TimeSlot) => {
    if (slot.isAvailable) setSelectedSlot(slot);
  };

  const handleBooking = async () => {
    if (!selectedSlot || !user || !profile) return;

    setLoading(true);

    try {
      // Create Razorpay order
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedSlot.price }),
      });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        throw new Error(`Create order failed: ${errorText}`);
      }

      const { orderId } = await orderResponse.json();

      if (!orderId)
        throw new Error("Invalid orderId received from create-order API");

      // Commission and payout
      const commission = selectedSlot.price * 0.094;
      const payout = selectedSlot.price - commission;

      const bookingData: Omit<Booking, "id" | "transactionId" | "createdAt"> = {
        turfId: turf.id,
        timeSlot: `${selectedSlot.startTime}-${selectedSlot.endTime}`,
        daySlot, // e.g., "Thursday"
        monthSlot: monthSlotLongYear, // e.g., "August 2025" (kept long for DB)
        userUid: user.uid,
        status: "pending",
        bookingDate: dateObj,
        price: selectedSlot.price,
        commission,
        payout,
        paid: "Not Paid to Owner",
      };

      // Initiate payment
      const bookingId = await initiatePayment({
        amount: selectedSlot.price.toString(),
        currency: "INR",
        orderId,
        userDetails: {
          name: profile.fullname,
          email: profile.email,
          contact: profile.mobile,
        },
        bookingDetails: bookingData,
      });

      toast("Booking Confirmed!", {
        description: "Your turf has been booked successfully.",
      });

      onBookingComplete({
        ...bookingData,
        id: bookingId,
        transactionId: orderId, // This is not entirely correct, but we'll use the orderId for now
        status: "confirmed",
        createdAt: new Date(),
      });
    } catch (error: unknown) {
      toast("Booking Failed", {
        description: (error as Error).message,
      });
      console.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Turf Details */}
      <Card className="bg-slate-900/70 border-slate-800 backdrop-blur">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <CardTitle className="text-white tracking-tight">
                {turf.name}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                <div className="flex items-center text-slate-300">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>
                    {turf.rating?.toFixed
                      ? turf.rating.toFixed(1)
                      : turf.rating}
                  </span>
                </div>
                <div className="flex items-center text-slate-300">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="truncate">{turf.address}</span>
                </div>
              </div>
            </div>

            {/* Premium price badge */}
            <Badge className="bg-gradient-to-r from-green-400 to-lime-500 text-black font-semibold shadow-md ring-1 ring-white/10 px-3 py-1.5 rounded-full">
              ₹{turf.price}/hour
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Date Selection + Separated Slot Chips */}
      <Card className="bg-slate-900/70 border-slate-800 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Selected Date
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-slate-200 text-base">
            {dateObj.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {/* Separated UI chips for Day / Month */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200 ring-1 ring-white/10">
              <span className="text-slate-400">Day Slot</span>
              <span className="font-medium">{daySlot}</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200 ring-1 ring-white/10">
              <span className="text-slate-400">Month Slot</span>
              <span className="font-medium">{monthSlotShort}</span>
            </span>
            {selectedSlot && (
              <span className="inline-flex items-center gap-2 rounded-full bg-green-500/15 px-3 py-1 text-xs text-green-300 ring-1 ring-green-400/30">
                <Clock className="w-3 h-3" />
                <span className="text-slate-300">Time Slot</span>
                <span className="font-semibold text-green-300">
                  {selectedSlot.startTime} – {selectedSlot.endTime}
                </span>
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Time Slot Selection */}
      <Card className="bg-slate-900/70 border-slate-800 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Available Time Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {turf.timeSlots.map((slot) => {
              const selected = selectedSlot?.id === slot.id;
              return (
                <Button
                  key={slot.id}
                  variant={selected ? "default" : "outline"}
                  className={[
                    "min-h-[60px] sm:min-h-[70px] p-3 flex flex-col items-center justify-center gap-1 text-left transition",
                    slot.isAvailable
                      ? selected
                        ? "bg-green-500 hover:bg-green-600 text-black border-transparent"
                        : "border-slate-700 text-slate-200 hover:bg-slate-800/60"
                      : "opacity-60 cursor-not-allowed border-slate-700 text-slate-500",
                  ].join(" ")}
                  onClick={() => handleSlotSelection(slot)}
                  disabled={!slot.isAvailable}
                >
                  <span className="text-sm font-semibold sm:text-base">
                    {slot.startTime} – {slot.endTime}
                  </span>
                  {!slot.isAvailable && (
                    <span className="text-[11px] text-red-400">Booked</span>
                  )}
                </Button>
              );
            })}
          </div>

          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Tip: Evening slots fill quickly. Lock yours early.
          </p>
        </CardContent>
      </Card>

      {/* Booking Summary */}
      {selectedSlot && (
        <Card className="bg-slate-900/70 border-slate-800 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Turf</span>
                <span className="font-medium text-slate-100">{turf.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date</span>
                <span className="font-medium text-slate-100">
                  {daySlot}, {monthSlotShort}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time Slot</span>
                <span className="font-medium text-slate-100">
                  {selectedSlot.startTime} – {selectedSlot.endTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration</span>
                <span className="font-medium text-slate-100">1 hour</span>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-3">
              <div className="flex justify-between items-center text-white font-semibold">
                <span>Total Amount</span>
                <span>₹{selectedSlot.price}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Free cancellation up to 24 hours before start.
              </p>
            </div>

            <Button
              onClick={handleBooking}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold"
              disabled={loading || !user}
            >
              {loading
                ? "Processing..."
                : `Pay ₹${selectedSlot.price} & Book Now`}
            </Button>

            {!user && (
              <p className="text-center text-slate-400 text-sm">
                Please login to continue with booking
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}