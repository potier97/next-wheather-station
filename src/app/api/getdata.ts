//api next to get data from firebase database
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// Configura tu aplicación Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// export default async function handler(req, res) {
//   const nodesRef = ref(db, "nodes");

//   // Escucha cambios en la base de datos en tiempo real
//   onValue(
//     nodesRef,
//     (snapshot) => {
//       const nodesData = snapshot.val();
//       res.status(200).json(nodesData);
//     },
//     {
//       onlyOnce: true // Esto evitará que la suscripción se mantenga abierta indefinidamente
//     }
//   );
// }
