import { Booking } from "../types/booking";

interface RazorpayOptions {
  key: string;
  amount: string;
  currency: string;
  order_id: string;
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
}

export interface PaymentOptions {
  amount: string;
  currency: string;
  orderId: string;
  userDetails: {
    name: string;
    email: string;
    contact: string;
  };
  bookingDetails: Omit<Booking, "id" | "transactionId" | "createdAt">;
}

export const initiatePayment = (options: PaymentOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!key) {
      reject(new Error("Razorpay key is missing in environment variables"));
      return;
    }

    const razorpayOptions: RazorpayOptions = {
      key,
      amount: options.amount,
      currency: options.currency,
      order_id: options.orderId,
      name: "TurfBuddie",
      description: "Turf Booking Payment",
      prefill: {
        name: options.userDetails.name,
        email: options.userDetails.email,
        contact: options.userDetails.contact,
      },
      theme: {
        color: "#16A249",
      },
      handler(response) {
        resolve(response.razorpay_payment_id);
      },
      modal: {
        ondismiss() {
          reject(new Error("Payment cancelled by user"));
        },
      },
    };

    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        resolve("pay_dummy_" + Date.now());
      }, 2000);
      return;
    }

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  });
};

export const verifyPayment = async (
  paymentId: string,
  orderId: string,
  signature: string
): Promise<boolean> => {
  try {
    const response = await fetch("/api/payment/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentId,
        orderId,
        signature,
      }),
    });

    const result = await response.json();
    return result.verified;
  } catch (error) {
    console.error("Payment verification failed:", error);
    return false;
  }
};
