import { Home, Person, Fastfood, Cart } from '../Icons';

// const food: NavItem<typeof Fastfood> = {
// 	icon: Fastfood,
// 	text: 'Essen',
// 	href: '/'
// };

export const navItems: NavItem[] = [
	{
		icon: Fastfood,
		text: 'Essen',
		href: '/food',
		size: {
			width: 27,
			height: 27
		}
	},
	{
		icon: Person,
		text: 'Profil',
		href: '/drinks'
	},
	{
		icon: Home,
		text: 'Startseite',
		href: '/'
	},
	{
		icon: Person,
		text: 'Profil',
		href: '/customer',
		rel: ['nofollow', 'ugc']
	},
	{
		icon: Cart,
		text: 'Warenkorb',
		href: '/cart',
		rel: ['nofollow', 'ugc']
	}
];
