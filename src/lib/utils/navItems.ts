import { home, person, fastfood, cart } from '../Icons';

import type { NavItem } from 'types/index';

// const food: NavItem<typeof Fastfood> = {
// 	icon: Fastfood,
// 	text: 'Essen',
// 	href: '/'
// };

export const navItems: NavItem[] = [
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
