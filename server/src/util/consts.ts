import dotenv from 'dotenv';
dotenv.config();

export const WEB_URL = process.env.WEB_URL as string;
export const PORT = process.env.PORT as string;
export const NODE_ENV = process.env.NODE_ENV as string;

export const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS as string;

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;
export const STRIPE_SECRET = process.env.STRIPE_SECRET as string;

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID as string;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET as string;

export const discord = {
	clientID: DISCORD_CLIENT_ID,
	clientSecret: DISCORD_CLIENT_SECRET,
	redirectURL: '/auth/handler', // http://localhost:8080
	scopes: ['identify']
};
