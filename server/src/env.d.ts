declare namespace NodeJS {
	export interface ProcessEnv {
		readonly DISCORD_CLIENT_ID: string;
		readonly DISCORD_CLIENT_SECRET: string;
		readonly STRIPE_SECRET: string;
		readonly STRIPE_WEBHOOK_SECRET: string;
		readonly GOOGLE_APPLICATION_CREDENTIALS: string;
	}

	export interface ImportMetaEnv {
		readonly DISCORD_CLIENT_ID: string;
		readonly DISCORD_CLIENT_SECRET: string;
		readonly STRIPE_SECRET: string;
		readonly STRIPE_WEBHOOK_SECRET: string;
		readonly GOOGLE_APPLICATION_CREDENTIALS: string;
	}
}
