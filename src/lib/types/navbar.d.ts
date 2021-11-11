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
	readonly rel?: AnchorLinkTypes | AnchorLinkTypes[];
	readonly size?: {
		readonly width: number;
		readonly height: number;
	};
}
