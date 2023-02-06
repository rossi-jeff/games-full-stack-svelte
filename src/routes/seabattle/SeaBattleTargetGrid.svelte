<script lang="ts">
	import { MaxAxis } from '$lib/sea-battle-functions';

	export let axis: number = 8;
	const horizontal = MaxAxis.H.slice(0, axis);
	const vertical = MaxAxis.V.slice(0, axis);
</script>

<div class="target-grid">
	<div class="top-header">
		<div />
		{#each horizontal as h}
			<div>{h}</div>
		{/each}
	</div>
	{#each vertical as v}
		<div class="grid-row" id="row-{v}">
			<div class="left-header">{v}</div>
			{#each horizontal as h}
				<div id="t-{h}-{v}">
					<span />
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	div.target-grid {
		@apply flex flex-col mb-4 mx-2;
	}
	div.top-header {
		@apply flex;
	}
	div.top-header div {
		@apply h-10 w-10 border border-dotted border-blue-900 font-bold text-center bg-blue-700 pt-2;
	}
	div.grid-row {
		@apply flex;
	}
	div.left-header {
		@apply h-10 w-10 border border-dotted border-blue-900 bg-blue-700 font-bold text-center pt-2;
	}
	div.grid-row div {
		@apply h-10 w-10 border border-dotted border-gray-500;
	}
</style>
