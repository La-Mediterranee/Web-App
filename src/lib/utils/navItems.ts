import { home, person, fastfood, cart } from '../Icons';
import { mdiFoodForkDrink } from '@mdi/js';

import type { NavItem } from 'types/index';

export const desktopNavItems: NavItem[] = [
	{
		icon: home,
		pathLabel: 'homepage',
		href: '/',
	},
	{
		icon: fastfood,
		pathLabel: 'food',
		href: '/food',
		size: {
			width: 27,
			height: 27,
		},
	},
	{
		icon: mdiFoodForkDrink,
		pathLabel: 'drinks',
		href: '/drinks',
	},
];

export const mobileNavItems: NavItem[] = [
	{
		icon: fastfood,
		pathLabel: 'food',
		href: '/food',
		size: {
			width: 27,
			height: 27,
		},
	},
	{
		icon: person,
		pathLabel: 'drinks',
		href: '/drinks',
	},
	{
		icon: home,
		pathLabel: 'homepage',
		href: '/',
	},
	{
		icon: person,
		pathLabel: 'account',
		href: '/customer',
		rel: ['nofollow', 'ugc'],
	},
	{
		icon: cart,
		pathLabel: 'cart',
		href: '/cart',
		rel: ['nofollow', 'ugc'],
	},
];
