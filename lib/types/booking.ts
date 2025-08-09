export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
}

export interface Turf {
  id: string;
  name: string;
  address: string;
  image: string;
  rating: number;
  price: number;
  timeSlots: TimeSlot[];
  amenities: string[];
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  ownerId: string;
  createdAt: Date;
}

export interface Booking {
  id: string;
  turfId: string;
  timeSlot: string;
  daySlot: string;
  monthSlot: string;
  userUid: string;
  transactionId: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  bookingDate: Date;
  price: number;
  commission: number;
  payout: number;
  paid: "Not Paid to Owner" | "Paid to Owner";
  createdAt: Date;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  image: string;
  prizePool: number;
  registrationFee: number;
  startDate: Date;
  endDate: Date;
  venue: string;
  maxTeams: number;
  registeredTeams: number;
  status: "upcoming" | "registration_open" | "ongoing" | "completed";
  sport: "cricket" | "football" | "badminton" | "tennis";
  rules: string[];
  organizer: string;
  createdAt: Date;
}
