import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function POST(request: NextRequest) {
  try {
    const { paymentId, orderId, signature, bookingData } = await request.json();

    // Basic input validation
    if (!paymentId || !orderId || !signature || !bookingData) {
      return NextResponse.json({ error: "Missing required payment data" }, { status: 400 });
    }

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

      try {
        const docRef = await addDoc(collection(db, "bookings"), booking);
        return NextResponse.json({ verified: true, bookingId: docRef.id });
      } catch (firestoreError) {
        console.error("Error saving booking to Firestore:", firestoreError);
        return NextResponse.json(
          { error: "Failed to save booking details" },
          { status: 500 }
        );
      }

    } else {
      return NextResponse.json({ verified: false }, { status: 400 });
    }
  } catch (error) {
    console.error("Payment verification process error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
