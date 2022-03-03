import { randomUUID } from 'node:crypto';

import type { RequestEvent, JSONObject, ShadowEndpointOutput } from '@sveltejs/kit/types/internal';

const cans = [
	{
		name: 'Red Bull 0.2L',
		price: 290,
		image: {
			src: 'https://www.redbull.com/energydrink/v1/resources/contentful/images/lcr8qbvxj7mh/02xkRv25i5j4owOiVwFSx/984069e87f0c831166d0fdbccc71bb0f/AT_RBED_250_Single-Unit_close_ambient_ORIGINAL_canwidth528px.png?w=420&h=1086&fm=webp&fit=fill&q=90',
			alt: '',
		},
	},

	//++++++++++++++++++++ 0.33L ++++++++++++++++++++//
	{
		name: 'Coca Cola 0.33L',
		price: 150,
		image: {
			src: 'https://d2csxpduxe849s.cloudfront.net/media/33C394AB-A9A7-44D3-B02389D9B9366FD8/FA6AE679-F613-468E-B06BD81A689179DD/9521973A-D958-4D6E-BC17F74FFEA619D6/webimage-158E9D77-1DF0-4E55-BB2D26AB65A8C3AD.png',
			alt: '',
		},
	},
	{
		name: 'Coca Cola Zero 0.33L',
		price: 150,
		image: {
			src: 'https://d2csxpduxe849s.cloudfront.net/media/33C394AB-A9A7-44D3-B02389D9B9366FD8/5ADE1F79-04EE-457F-96C65F53ABB0C05D/D99518D3-5630-44D2-890E4504D95BEEFC/webimage-05ACB374-EA1B-401C-815B166459D1BB01.png',
			alt: '',
		},
	},
	{
		name: 'Fanta 0.33L',
		price: 150,
		image: {
			// src: 'https://d2csxpduxe849s.cloudfront.net/media/33C394AB-A9A7-44D3-B02389D9B9366FD8/4C53522F-1FD0-4D35-843EC7C559C44F11/07F2C8C3-FA05-4582-A4F5C8A625C7E47B/webimage-11774BD2-1402-4D41-AAC85AA2D383F042.png',
			src: '/drinks/Fanta_0,33l/FANTA_Orange_0_33L_CAN.webp',
			alt: 'Almdudler Original Flasche 0.33L',
			height: '4401',
			width: '1270',
		},
	},
	{
		name: 'Sprite 0.33L',
		price: 150,
		image: {
			// src: 'https://d2csxpduxe849s.cloudfront.net/media/33C394AB-A9A7-44D3-B02389D9B9366FD8/0833EE8C-BB3A-412C-81AEFD44F51BE612/webimage-65FB3542-CA71-49F5-917532C694318C85.png',
			src: '/drinks/Sprite_0,33l/SPRITE_Fresh_0_33L.webp',
			alt: '',
		},
	},
];

const half = [
	{
		name: 'Almdudler 0.5L',
		price: 190,
		image: {
			src: '/drinks/Almdudler/Almdudler_0_5L.webp',
			alt: 'Almdudler Original Flasche 0.5L',
		},
	},
	{
		name: 'Coca Cola Zero 0.5L',
		price: 190,
		image: {
			src: 'https://d2csxpduxe849s.cloudfront.net/media/33C394AB-A9A7-44D3-B02389D9B9366FD8/B0CCA38E-44B0-434B-9337A194203CAF1E/070AB568-7636-4511-990D3F0EDF86138D/webimage-D587597E-B8F8-473C-BE0B055333ADA994.png',
			alt: '',
		},
	},
	{
		name: 'Coca Cola 0.5L',
		price: 190,
		image: {
			src: 'https://d2csxpduxe849s.cloudfront.net/media/33C394AB-A9A7-44D3-B02389D9B9366FD8/ED92AAA1-74C0-4235-A930A1B05A7B7829/B9181C73-D690-49E7-AAB5F5B97660F9CB/webimage-425C7651-7C48-4A4F-AEF45B51436AA4A1.png',
			alt: '',
		},
	},

	{
		name: 'Sprite 0.5L',
		price: 190,
		image: {
			//src: 'https://d2csxpduxe849s.cloudfront.net/media/33C394AB-A9A7-44D3-B02389D9B9366FD8/C77F5DB0-D3E7-40F1-AB95709B1EB9DB72/webimage-78BD86E2-C12C-42CD-A1F0612A1BF8AFBD.png',
			src: '/drinks/Sprite_0,5l/SPRITE_Fresh_0_5L.webp',
			alt: '',
		},
	},
	{
		name: 'Fanta 0.5L',
		price: 190,
		image: {
			// src: 'https://d2csxpduxe849s.cloudfront.net/media/33C394AB-A9A7-44D3-B02389D9B9366FD8/6A422523-E409-4DD4-BE2BD4F29A67DB60/webimage-D6EBA58A-E35F-4412-A2068C692F4BD696.png',
			src: '/drinks/Fanta_0,5l/FANTA_Orange_0_5L.webp',
			alt: '',
		},
	},
	{
		name: 'Eistee Zitrone 0.5L',
		price: 190,
		image: {
			src: '/drinks/Rauch/Eistee_Pfirsich_0_5L/Eistee_Pfirsich_0_5L.webp',
		},
	},
	{
		name: 'Eistee Pfirsich 0.5L',
		price: 190,
		image: {
			src: '/drinks/Rauch/Eistee_Zitrone_0_5L/Eistee_Zitrone_0_5L.webp',
		},
	},
	{
		name: 'Mineralwasser 0.5L',
		price: 170,
		image: {
			src: '/drinks/RomerQuelle_prickelnd/RÖMERQUELLE_prickelnd_1_0.webp',
			alt: '',
		},
	},
	{
		name: 'Rauch Happy Day Sprizz 0.5L',
		price: 190,
		image: {
			src: '/drinks/Rauch/Rauch_Happy_Day_Sprizz_0_5L/Rauch_Happy_Day_Sprizz_0_5L.webp',
			alt: '',
		},
	},
	{
		name: 'Multivitamin 0.5L',
		price: 190,
		image: {
			src: '/drinks/Rauch/Rauch_Multivit_0_5L/Rauch_Multivit_0_5L.webp',
		},
	},
];

export async function get(event: RequestEvent): Promise<ShadowEndpointOutput> {
	const drinks = [
		//++++++++++++++++++++ 0.33L ++++++++++++++++++++//
		...cans,
		//++++++++++++++++++++ 0.5L ++++++++++++++++++++//
		...half,

		{
			name: 'Römerquelle Prickelnd 1.5L',
			price: 280,
			image: {
				// src: 'https://d2csxpduxe849s.cloudfront.net/media/33C394AB-A9A7-44D3-B02389D9B9366FD8/F4BF7B8B-AC8A-451C-8A8FAC343E6033A1/webimage-E4A8C807-13F2-4B61-85EF154D8E658E00.png',
				src: '/drinks/RomerQuelle_prickelnd/RÖMERQUELLE_prickelnd_1_0.webp',
				alt: '',
			},
		},
		{
			name: 'Sprite 1.5L',
			price: 450,
			image: {
				//src: 'https://d2csxpduxe849s.cloudfront.net/media/33C394AB-A9A7-44D3-B02389D9B9366FD8/B4B9E951-6877-415C-8B83C0868D0EC44A/webimage-0DD7EC51-9AF3-4542-8C15CF2A96B287AA.png',
				src: '/drinks/Sprite_1,5l/SPRITE_1_5L.webp',
				alt: '',
			},
		},
		{
			name: 'Fanta 1.5L',
			price: 450,
			image: {
				// src: 'https://d2csxpduxe849s.cloudfront.net/media/33C394AB-A9A7-44D3-B02389D9B9366FD8/BACC1CD3-5341-4FA8-9EFB99D49140F788/webimage-232477C4-FD4F-4542-9032FD2FE546C2D6.png',
				src: '/drinks/Fanta_1,5l/FANTA_Orange_1_5L.webp',
				alt: '',
			},
		},
		{
			name: 'Coca Cola 1.5L',
			price: 450,
			image: {
				src: 'https://d2csxpduxe849s.cloudfront.net/media/33C394AB-A9A7-44D3-B02389D9B9366FD8/53975349-F29C-47A7-83DF8077DF8C0F51/EEFB6995-4ACC-43C2-B076C96C0A3B02A5/webimage-739D7FAE-1C86-4664-AAC63C49CEACDFBA.png',
				alt: '',
			},
		},
		{
			name: 'Coca Cola Zero 1.5L',
			price: 450,
			image: {
				src: 'https://d2csxpduxe849s.cloudfront.net/media/33C394AB-A9A7-44D3-B02389D9B9366FD8/6D1351ED-1BF5-42EC-A6089295742DAAA9/3AEAD8EB-E092-4AE3-807EDA585E4FEA5D/webimage-C22FB73B-079D-434A-BAFF491586CF7BA0.png',
				alt: '',
			},
		},
		{
			name: 'Eistee Zitrone 1.5L',
			price: 330,
			image: {
				src: '/drinks/Rauch/Eistee_Zitrone_1_5L/Eistee_Zitrone_1_5L.webp',
			},
		},
		{
			name: 'Eistee Pfirsich 1.5L',
			price: 330,
			image: {
				src: '/drinks/Rauch/Eistee_Pfirsich_1_5L/Eistee_Pfirsich_1_5L.webp',
			},
		},

		//++++++++++++++++++++ 2L ++++++++++++++++++++//
		{
			name: 'Pepsi 2L',
			price: 450,
			image: {
				// src: 'https://pepsi-images.com/material/02_Pepsi/Produktabbildungen/Ab_April_2021/1500ml/Pepsi_Cola_1500ml.jpg',
				src: '/drinks/Pepsi/Pepsi_Cola_1500ml.webp',
				alt: '',
			},
		},
	];

	//mineralwasser mit/ohne 1.5L 280
	//eistee pfirsich/zitrone 1.5L 330
	//aluvera 0.5L/0.3L

	return {
		body: <JSONObject>{
			drinks: drinks.map(drink => Object.assign(drink, { ID: randomUUID() })),
		},
	};
}
