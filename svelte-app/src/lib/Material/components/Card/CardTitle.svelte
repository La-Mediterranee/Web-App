<script lang="ts">
	let klass = '';
	export { klass as class };
	export let style = null;
	export let itemprop: string;
</script>

<div class="s-card-title {klass}" {style} {itemprop}>
	<slot />
</div>

<style lang="scss" src="./CardTitle.scss" global>
</style>
