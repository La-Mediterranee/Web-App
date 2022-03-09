import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export const {
	EDAMAM_API_KEY,
	STRIPE_WEBHOOK_SECRET,
	STRIPE_SECRET_API,
	GOOGLE_APPLICATION_CREDENTIALS,
	SERVER_PORT,
} = process.env;

export const SERVER_URL = `http://localhost:${SERVER_PORT}`;
