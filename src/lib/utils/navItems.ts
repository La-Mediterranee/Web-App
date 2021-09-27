import { home, person, fastfood, cart } from '../Icons';
import { mdiFoodForkDrink } from '@mdi/js';

import type { NavItem } from 'types/index';

export const desktopNavItems: NavItem[] = [
	{
		icon: home,
		text: 'Startseite',
		href: '/',
	},
	{
		icon: fastfood,
		text: 'Essen',
		href: '/food',
		size: {
			width: 27,
			height: 27,
		},
	},
	{
		icon: mdiFoodForkDrink,
		text: 'Getränke',
		href: '/drinks',
	},
];

export const mobileNavItems: NavItem[] = [
	{
		icon: fastfood,
		text: 'Essen',
		href: '/food',
		size: {
			width: 27,
			height: 27,
		},
	},
	{
		icon: person,
		text: 'Profil',
		href: '/drinks',
	},
	{
		icon: home,
		text: 'Startseite',
		href: '/',
	},
	{
		icon: person,
		text: 'Profil',
		href: '/customer',
		rel: ['nofollow', 'ugc'],
	},
	{
		icon: cart,
		text: 'Warenkorb',
		href: '/cart',
		rel: ['nofollow', 'ugc'],
	},
];
