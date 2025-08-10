// lib/firebase/admin.ts

import admin from "firebase-admin";
import { getApps } from "firebase-admin/app";
import { ServiceAccount } from "firebase-admin/app";

// Your downloaded service account key
import serviceAccount from "@/serviceAccountKey.json";

// Check if the app is already initialized to prevent errors
if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
}

const adminDb = admin.firestore();
export { adminDb };
