<script lang="ts">
	import type { Card } from '$lib/deck';
	import { createEventDispatcher, onMount } from 'svelte';

	export let card: Card;
	export let from: string;
	export let level: number;

	const dispatch = createEventDispatcher();

	const setTop = () => {
		const top = level * 1.5 + 0.5;
		const div = document.getElementById(`${from}_${card.id}`);
		if (div) div.style.top = `${top}rem`;
	};

	const dragStart = (event: any) => {
		dispatch('dragStart', event);
	};

	onMount(() => {
		setTop();
	});
</script>

<div
	class="free-cell-card-wrapper"
	id="{from}_{card.id}"
	draggable={card.draggable}
	on:dragstart={dragStart}
>
	<img
		src={card.src}
		alt="{card.face.toUpperCase()} of {card.suit.toUpperCase()}"
		class="card-face"
		draggable="false"
		id="front_{card.id}"
	/>
</div>

<style>
	div.free-cell-card-wrapper {
		@apply w-28 h-36 p-0 absolute top-2 left-2;
	}
	img.card-face {
		@apply w-24 h-32 cursor-move;
	}
</style>
