<script lang="ts">
	import { Card, Deck } from '$lib/deck';
	import { onMount } from 'svelte';
	import { zeroPad } from '../../lib/mysql-date-format';
	import ConcentrationBack from './ConcentrationBack.svelte';
	import ConcentrationCard from './ConcentrationCard.svelte';

	let deck: Deck;
	let dealt: boolean = false;
	let cardOne: Card | undefined,
		cardTwo: Card | undefined,
		idxOne: number | undefined,
		idxTwo: number | undefined;
	let timeout: ReturnType<typeof setTimeout> | undefined;
	let interval: ReturnType<typeof setInterval> | undefined;
	class cardHandler {
		flipCard() {}
		showCard() {}
		hideCard() {}
	}
	let handlers: cardHandler[] = [];
	let turns: number = 0;
	let matched: number = 0;
	let start: number, elapsed: number;
	let cardBacks: string[] = [];
	let backSelected: boolean = true;

	const deal = () => {
		dealt = false;
		turns = 0;
		matched = 0;
		elapsed = 0;
		start = Date.now();
		deck.shuffle();
		if (interval) clearInterval(interval);
		if (timeout) clearTimeout(timeout);
		clock();
		dealt = true;
	};

	const loadDeck = () => {
		deck = new Deck();
		handlers = [];
		elapsed = 0;
		for (let i = 0; i < deck.cards.length; i++) {
			handlers[i] = new cardHandler();
			handlers[i].showCard();
		}
		cardBacks = deck.backs;
		preload();
	};

	const preload = () => {
		let images = [];
		let idx = 0;
		for (const back of deck.backs) {
			images[idx] = new Image();
			images[idx].src = `/cards/back/${back}.svg`;
			idx++;
		}
		for (const card of deck.cards) {
			images[idx] = new Image();
			images[idx].src = card.src;
			idx++;
		}
	};

	const cardClicked = (event: any) => {
		if (timeout) return;
		const { idx, card } = event.detail;
		if (idxOne === idx || idxTwo === idx) return;
		if (cardOne) {
			cardTwo = card;
			idxTwo = idx;
			handlers[idx].flipCard();
			timeout = setTimeout(() => handleCards(), 2500);
		} else {
			cardOne = card;
			idxOne = idx;
			handlers[idx].flipCard();
		}
	};

	const handleCards = () => {
		if (
			cardOne === undefined ||
			cardTwo === undefined ||
			idxOne === undefined ||
			idxTwo === undefined
		)
			return;
		if (cardOne.face === cardTwo.face) {
			handlers[idxOne].hideCard();
			handlers[idxTwo].hideCard();
			matched++;
		} else {
			handlers[idxOne].flipCard();
			handlers[idxTwo].flipCard();
		}
		idxOne = undefined;
		idxTwo = undefined;
		cardOne = undefined;
		cardTwo = undefined;
		timeout = undefined;
		turns++;
		if (matched === deck.cards.length / 2 && interval) {
			clearInterval(interval);
			dealt = false;
		}
	};

	const displayElapsed = (allSeconds: number) => {
		const seconds = allSeconds % 60;
		const minutes = Math.floor(allSeconds / 60);
		return minutes > 0 ? `${minutes}:${zeroPad(seconds)}` : seconds;
	};

	const clock = () => {
		elapsed = 0;
		interval = setInterval(() => {
			elapsed = Math.round((Date.now() - start) / 1000);
		}, 1000);
	};

	const selectBack = (event: any) => {
		const { back } = event.detail;
		backSelected = false;
		deck.setBack(deck.backs.indexOf(back));
		deck.build();
		setTimeout(() => {
			backSelected = true;
		}, 25);
	};

	onMount(() => {
		loadDeck();
	});
</script>

<div class="concentration-container">
	{#if dealt && deck.cards}
		<div class="cards-wrap">
			{#each deck.cards as card, idx}
				<ConcentrationCard
					{card}
					{idx}
					on:cardClicked={cardClicked}
					bind:flipCard={handlers[idx].flipCard}
					bind:hideCard={handlers[idx].hideCard}
					bind:showCard={handlers[idx].showCard}
				/>
			{/each}
		</div>
	{:else}
		<h2>Select Card Back</h2>
		<div class="backs-wrap">
			{#if cardBacks.length && backSelected}
				{#each cardBacks as back}
					<ConcentrationBack {back} selected={deck.back} on:backClicked={selectBack} />
				{/each}
			{/if}
		</div>
		<div>
			<button on:click={deal}>Deal</button>
		</div>
	{/if}
	<div class="flex justify-between">
		<span>
			<strong>Turns</strong>
			{turns}
		</span>
		<span>
			<strong>Matches</strong>
			{matched}
		</span>
		<span>
			<strong>Elapsed</strong>
			{displayElapsed(elapsed)}
		</span>
	</div>
</div>

<style>
	div.concentration-container {
		@apply mx-2 p-4 bg-green-600 rounded h-screen;
	}
	h2 {
		@apply text-lg font-bold mb-2;
	}
	div.cards-wrap {
		@apply flex flex-wrap;
	}
	div.backs-wrap {
		@apply flex flex-wrap mb-4 min-h-max;
	}
	button {
		@apply bg-white border border-black rounded py-1 px-2;
	}
</style>
