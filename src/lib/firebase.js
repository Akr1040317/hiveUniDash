import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// US Scripps National Spelling Bee Firebase configuration
const usFirebaseConfig = {
  apiKey: "AIzaSyBOdt1j8ByGUx5OyLCXoHd3UCUdSmpr2jE",
  authDomain: "beeapp-5c98b.firebaseapp.com",
  projectId: "beeapp-5c98b",
  storageBucket: "beeapp-5c98b.appspot.com",
  messagingSenderId: "835743244667",
  appId: "1:835743244667:web:b91ce308c109cc48c55dde",
  measurementId: "G-R7B107LC45"
};

// Dubai National Spelling Bee Firebase configuration
const dubaiFirebaseConfig = {
  apiKey: "AIzaSyAyfBYlIcW0Zmgq2EyNQo1-71Acs-ButoE",
  authDomain: "prepcenter-750c1.firebaseapp.com",
  projectId: "prepcenter-750c1",
  storageBucket: "prepcenter-750c1.firebasestorage.app",
  messagingSenderId: "1017753872062",
  appId: "1:1017753872062:web:426d4e3dc5f862995be0ef",
  measurementId: "G-WT9MGFTL8P"
};

// Initialize Firebase apps for both regions
export const usApp = initializeApp(usFirebaseConfig, 'us');
export const dubaiApp = initializeApp(dubaiFirebaseConfig, 'dubai');

// Get auth instances
export const usAuth = getAuth(usApp);
export const dubaiAuth = getAuth(dubaiApp);

// Get Firestore instances
export const usDb = getFirestore(usApp);
export const dubaiDb = getFirestore(dubaiApp);

// Get analytics instances
export const usAnalytics = getAnalytics(usApp);
export const dubaiAnalytics = getAnalytics(dubaiApp);

// Helper function to get the appropriate Firebase instances based on region
export const getFirebaseInstances = (region) => {
  switch (region) {
    case 'us':
      return {
        auth: usAuth,
        db: usDb,
        analytics: usAnalytics
      };
    case 'dubai':
      return {
        auth: dubaiAuth,
        db: dubaiDb,
        analytics: dubaiAnalytics
      };
    default:
      return {
        auth: usAuth,
        db: usDb,
        analytics: usAnalytics
      };
  }
};
