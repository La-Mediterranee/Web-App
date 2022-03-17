import { home, person, fastfood, cart, drink, burger } from '../Icons';
import cartOutlined from '../Icons/cart';

import { mdiFoodForkDrink } from '@mdi/js';

import type { NavItem } from 'types/index';

export const desktopNavItems: NavItem[] = [
	{
		icon: home,
		pathLabel: 'homepage',
		href: '/',
	},
	{
		icon: burger,
		pathLabel: 'food',
		href: '/food',
		size: {
			width: 27,
			height: 27,
		},
	},
	{
		icon: drink, //mdiFoodForkDrink
		pathLabel: 'drinks',
		href: '/drinks',
	},
];

export const mobileNavItems: NavItem[] = [
	{
		icon: burger,
		pathLabel: 'food',
		href: '/food',
		route: 'food',
		// size: {
		// 	width: 27,
		// 	height: 27,
		// },
	},
	{
		icon: drink,
		pathLabel: 'drinks',
		href: '/drinks',
		route: 'drinks',
	},
	{
		icon: home,
		pathLabel: 'homepage',
		href: '/',
		route: 'homepage',
	},
	{
		icon: person,
		pathLabel: 'account',
		href: '/customer',
		route: 'customer',
		rel: ['nofollow', 'ugc'],
	},
	{
		icon: cartOutlined,
		pathLabel: 'cart',
		href: '/cart',
		route: 'cart',
		// size: {
		// 	width: 29,
		// 	height: 29,
		// },
		rel: ['nofollow', 'ugc'],
	},
];
