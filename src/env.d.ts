// +++++++++++++ CLIENT +++++++++++++
interface ImportMetaEnv {
	// Shop
	readonly VITE_SHOP_NAME: string;
	readonly VITE_SHOP_OWNER: string;
	readonly VITE_SHOP_LOGO: string;
	readonly VITE_SHOP_URL: string;
	readonly VITE_SERVER_URL: string;
	// Sentry
	readonly VITE_SENTRY_DNS: string;
	// Google Analytics
	readonly VITE_GA_MEASUREMENT_ID: string;
	// Stripe
	readonly VITE_STRIPE_PUBLIC_KEY: string;
	// Firebase
	readonly VITE_FIREBASE_API_KEY: string;
	readonly VITE_FIREBASE_AUTH_DOMAIN: string;
	readonly VITE_FIREBASE_DATABASE_URL: string;
	readonly VITE_FIREBASE_PROJECT_ID: string;
	readonly VITE_FIREBASE_STORAGE_BUCKET: string;
	readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
	readonly VITE_FIREBASE_APP_ID: string;
	readonly VITE_FIREBASE_MEASUREMENT_ID: string;
	readonly VITE_FIREBASE_VAPID_KEY: string;
}

// +++++++++++++ SERVER +++++++++++++
declare namespace NodeJS {
	interface ProcessEnv {
		readonly EDAMAM_API_KEY: string;
		readonly STRIPE_SECRET_API: string;
		readonly STRIPE_WEBHOOK_SECRET: string;
		readonly GOOGLE_API_KEY: string;
		readonly SERVER_PORT: string;
	}
}
