import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function POST(request: NextRequest) {
  try {
    const { paymentId, orderId, signature, bookingData } = await request.json();

    // Verify payment signature
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === signature;
    if (isAuthentic) {
      // Save booking to Firestore
      const booking = {
        ...bookingData,
        transactionId: paymentId,
        status: "confirmed",
        createdAt: new Date(),
      };

      await addDoc(collection(db, "bookings"), booking);

      return NextResponse.json({ verified: true, bookingId: booking.id });
    } else {
      return NextResponse.json({ verified: false }, { status: 400 });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
