<!-- {#if $$slots.default}
	<p class="desc" itemprop="description">
		<span>
			<slot />
		</span>
	</p>
{/if} -->

<p class="desc" itemprop="description">
	<span>
		<slot />
	</span>
</p>

<style lang="scss">
	.desc {
		text-align: center;
		padding: 0 0.5em;

		line-height: 1.3em;
		height: 2.6em;

		margin: 0.4em 0;

		span {
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
</style>
