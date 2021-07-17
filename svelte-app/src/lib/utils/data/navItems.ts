import { Home, Person, Fastfood, Cart } from '../../Icons';

export interface NavItem {
	readonly icon: unknown;
	readonly text: string;
	readonly href: string;
	readonly size?: {
		readonly width: number;
		readonly height: number;
	};
}

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
		href: '/customer'
	},
	{
		icon: Cart,
		text: 'Warenkorb',
		href: '/cart'
	}
];