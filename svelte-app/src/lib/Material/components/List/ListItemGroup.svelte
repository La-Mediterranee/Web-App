<script lang="ts">
	import { setContext } from "svelte";
	import ItemGroup, { ITEM_GROUP } from "../ItemGroup/ItemGroup.svelte";

	setContext("S_ListItemRole", "option");
	setContext("S_ListItemGroup", ITEM_GROUP);

	let klass = "primary-text";
	export { klass as class };
	export let value: any[] = [];
	export let activeClass = "active";
	export let multiple = false;
	export let mandatory = false;
	export let max = Infinity;
	export let style: string | undefined = undefined;
</script>

<ItemGroup
	class="s-list-item-group {klass}"
	role="listbox"
	bind:value
	{activeClass}
	{multiple}
	{mandatory}
	{max}
	{style}
>
	<slot />
</ItemGroup>

<style lang="scss" src="./ListItemGroup.scss" global>
</style>
