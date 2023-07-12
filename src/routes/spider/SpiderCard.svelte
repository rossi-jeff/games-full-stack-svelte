<script lang="ts">
	import type { Card } from '$lib/deck';
	import { createEventDispatcher, onMount } from 'svelte';

	export let card: Card;
	export let from: string;
	export let level: number;

	const dispatch = createEventDispatcher();

	const cardClicked = () => {
		console.log('cardClicked', card.clickable);
		if (!card.clickable) return;
		dispatch('cardClicked', { card, from, level });
	};

	const dragStart = (event: any) => {
		if (!card.draggable) return;
		dispatch('dragStart', event);
	};

	const setTop = () => {
		const top = level * 1.5 + 0.5;
		const div = document.getElementById(`${from}_${card.id}`);
		if (div) div.style.top = `${top}rem`;
	};

	const cursorClasses = () => {
		const el = document.getElementById(`${from}_${card.id}`);
		if (el) {
			if (card.clickable) el.classList.add('clickable');
			if (card.draggable) el.classList.add('draggable');
		}
	};

	onMount(() => {
		setTop();
		cursorClasses();
	});
</script>

<div
	class="spider-card-wrapper"
	id="{from}_{card ? card.id : ''}"
	draggable={card && card.draggable}
	on:click={cardClicked}
	on:keydown={cardClicked}
	on:dragstart={dragStart}
>
	{#if card && card.facedown}
		<img
			src={card.backSrc}
			alt="card back"
			class="card-back"
			draggable="false"
			id="back_{card.id}"
		/>
	{:else if card}
		<img
			src={card.src}
			alt="{card.face.toUpperCase()} of {card.suit.toUpperCase()}"
			class="card-face"
			draggable="false"
			id="front_{card.id}"
		/>
	{/if}
</div>

<style>
	div.spider-card-wrapper {
		@apply w-28 h-36 p-0 absolute top-2 left-2;
	}
	img.card-back,
	img.card-face {
		@apply w-24 h-32;
	}
	:global(div.clickable) {
		@apply cursor-pointer;
	}
	:global(div.draggable) {
		@apply cursor-move;
	}
</style>
