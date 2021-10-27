import type { PWAConfig } from './config';

/** @type {import("./config").PWAConfig} */
const config = {
	appName: 'Test',
	iconPath: './V4.png',
	headConfig: {
		externalStyleSheets: ['https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600;800&display=swap'],
		preConnections: [
			'https://fonts.gstatic.com',
			'https://fonts.googleapis.com',
			'https://www.googletagmanager.com',
		],
	},
} as PWAConfig;

// module.exports = config;
export default config;
