import Tabbar from './Tabbar.svelte';

import type { NavItem } from 'types/navbar';

export interface TabbarItem extends Omit<NavItem, 'rel'> {
	readonly isActive: boolean;
	readonly route?: string;
	readonly rel: string | undefined;
}

export default Tabbar;
