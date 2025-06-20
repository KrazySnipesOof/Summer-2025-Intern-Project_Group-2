import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCYxFdQLiQwh-s8r-3d1l-mmWEy1UWNSKw",
  authDomain: "bisiblvd-a4d68.firebaseapp.com",
  databaseURL: "https://bisiblvd-a4d68-default-rtdb.firebaseio.com",
  projectId: "bisiblvd-a4d68",
  storageBucket: "bisiblvd-a4d68.appspot.com",
  messagingSenderId: "106359115992",
  appId: "1:106359115992:web:fbc269dea108de146dc7ad",
  measurementId: "G-4CYCZW2E3M"
};
const app = initializeApp(firebaseConfig);

export default app;
export const messaging = getMessaging(app);

export const getTokens = async (setTokenFound) => {
  let currentToken = "";
  const firebasePublicKey =
    "BLm5AAlxQ8hu95ZmVbAYWpMa5XDU4Q7pMQSy1GFceNJsjYPkO3YS2El1l_JvEpKL7zFE-bmpYijqADCoueDNKL4";
  try {
    currentToken = await getToken(messaging, {
      vapidKey: firebasePublicKey,
    });
    if (currentToken) {
      setTokenFound?.(true);
    } else {
      setTokenFound?.(false);
    }
  } catch (error) {
    console.log("An error occurred while retrieving token. ", error);
  }

  return currentToken;
};

export const onMessageListener = () => {
 return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
     return resolve(payload);
    });
  });
};
