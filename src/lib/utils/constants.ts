export const SHOP_OWNER = import.meta.env.VITE_SHOP_OWNER;
export const SHOP_NAME = import.meta.env.VITE_SHOP_NAME;
export const SHOP_LOGO = import.meta.env.VITE_SHOP_LOGO;
export const SHOP_URL = import.meta.env.VITE_SHOP_URL;
export const VITE_SERVER_URL = import.meta.VITE_SERVER_URL;

export const NODE_ENV = import.meta.env.NODE_ENV;

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

export const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const mediQueries = {
	xs: '0px',
	sm: '600px',
	md: '960px',
	lg: '1280px',
	xl: '1920px',
};
