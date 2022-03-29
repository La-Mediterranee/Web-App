<script lang="ts">
	export let id: Attributes<HTMLElement>['id'];
</script>

<fieldset {id} class="topping">
	<slot />
</fieldset>

<style lang="scss">
	.topping {
		border: none;
		margin: 1em 0;
		padding: 0.4em 0;
		display: flex;
		flex-wrap: wrap;

		&:last-child {
			margin-bottom: 0;
		}
	}
</style>
