import { getContext } from 'svelte';
import { MODAL_KEY } from './utils/constants';

import type { ModalContext } from './types';

export { default } from './Modals.svelte';

export const getModalContext = () => getContext<ModalContext>(MODAL_KEY);
