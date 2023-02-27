<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let face: number = 1;
	export let idx: number = 0;
	export let draggable: boolean = false;
	export let from: string;
	let folder = '/dice';
	const src = `${folder}/dice-${face}.svg`;
	const alt = `Die ${face}`;

	const dispatch = createEventDispatcher();

	const dragStart = (event: any) => {
		dispatch('dragStart', event);
	};
</script>

<div class="ten-grand-die" {draggable} id="{from}-{idx}-{face}" on:dragstart={dragStart}>
	<img {src} {alt} class="w-16 h-16" draggable="false" />
</div>

<style>
	div.ten-grand-die {
		@apply bg-white w-16 h-16 p-0 rounded;
	}
</style>
