<script context="module" lang="ts">
	import { setContext } from 'svelte';

	import { MODAL, PRODUCT_MODAL } from '$lib/utils/constants';

	function open() {}
	function close() {}
</script>

<script lang="ts">
	import Modal from 'svelte-material-components/src/components/Dialog/Dialog.svelte';

	let active = false;

	setContext(MODAL, {
		open,
		close,
	});

	setContext(PRODUCT_MODAL, {
		open,
		close,
	});
</script>

<slot />
<Modal bind:active />
