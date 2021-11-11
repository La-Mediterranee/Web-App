import { home, person, fastfood, cart } from '../Icons';
import { mdiFoodForkDrink } from '@mdi/js';

import type { NavItem } from 'types/index';

export const desktopNavItems: NavItem[] = [
	{
		icon: home,
		pathLabel: 'homepage',
		// text: 'Startseite',
		href: '/',
	},
	{
		icon: fastfood,
		pathLabel: 'food',
		// text: 'Essen',
		href: '/food',
		size: {
			width: 27,
			height: 27,
		},
	},
	{
		icon: mdiFoodForkDrink,
		pathLabel: 'drinks',
		// text: 'Getränke',
		href: '/drinks',
	},
];

export const mobileNavItems: NavItem[] = [
	{
		icon: fastfood,
		pathLabel: 'food',
		// text: 'Essen',
		href: '/food',
		size: {
			width: 27,
			height: 27,
		},
	},
	{
		icon: person,
		pathLabel: 'drinks',
		// text: 'Profil',
		href: '/drinks',
	},
	{
		icon: home,
		pathLabel: 'homepage',
		// text: 'Startseite',
		href: '/',
	},
	{
		icon: person,
		pathLabel: 'profile',
		// text: 'Profil',
		href: '/customer',
		rel: ['nofollow', 'ugc'],
	},
	{
		icon: cart,
		pathLabel: 'cart',
		// text: 'Warenkorb',
		href: '/cart',
		rel: ['nofollow', 'ugc'],
	},
];
