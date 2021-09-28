export default {
	direction: 'ltr',
	lang: 'de',
	siteName: 'La Mediterranee Lieferapp',
	siteShortName: 'La Mediterranee',
	scope: '/',
	start_url: '/?utm_source=homescreen',
	display: 'standalone',
	orientation: 'portrait',
	themeColor: 'aliceblue',
	backgroundColor: '#FFFFFF',
	categories: ['food', 'shopping', 'fast food'],
	shortcuts: [
		{
			name: 'Bestellungen Anschauen',
			url: '',
			icons: [
				{
					src: '/icons/see-orders.png',
					sizes: '192x192',
				},
			],
		},
	],
	icons: [
		{
			src: 'icon/lowres.webp',
			sizes: '48x48',
			type: 'image/webp',
		},
		{
			src: 'icon/lowres',
			sizes: '48x48',
		},
		{
			src: 'icon/hd_hi.ico',
			sizes: '72x72 96x96 128x128 256x256',
		},
		{
			src: 'icon/hd_hi.svg',
			sizes: '72x72',
		},
	],
	screenshots: [
		{
			src: 'screenshot1.webp',
			sizes: '1280x720',
			type: 'image/webp',
		},
		{
			src: 'screenshot2.webp',
			sizes: '1280x720',
			type: 'image/webp',
		},
	],
} as const;
