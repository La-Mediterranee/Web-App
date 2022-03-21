export type AnchorLinkTypes =
	| 'alternate'
	| 'author'
	| 'bookmark'
	| 'external'
	| 'help'
	| 'license'
	| 'next'
	| 'nofollow'
	| 'noopener'
	| 'noreferrer'
	| 'prev'
	| 'search'
	| 'prev'
	| 'ugc'
	| 'tag';

export interface NavItem {
	readonly icon: string;
	readonly pathLabel: string;
	readonly href: string;
	readonly route?: string;
	readonly rel?: AnchorLinkTypes | AnchorLinkTypes[];
	readonly size?: {
		readonly width: number;
		readonly height: number;
	};
}

export interface INavbarItem extends Omit<NavItem, 'rel'> {
	readonly rel: string;
}

export interface ITabbarItem extends Omit<NavItem, 'rel'> {
	readonly isActive: boolean;
	readonly route?: string;
	readonly rel: string | undefined;
}
