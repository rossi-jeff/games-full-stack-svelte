<script lang="ts">
	import { onMount } from 'svelte';
	import { Deck, type Card } from '../../lib/deck';
	import type { FlagType } from '../../lib/types/flag.type';
	import KlondikeBack from './KlondikeBack.svelte';

	let aces: { [key: number]: Card[] } = {};
	let tableau: { [key: number]: Card[] } = {};
	let stack: Card[];
	let waste: Card[];
	let deck: Deck;
	class cardHandler {
		flipCard() {}
	}
	let handlers: { [key: number]: cardHandler } = {};
	let cardBacks: string[] = [];
	let card: Card | undefined;
	let flags: FlagType = {
		playing: false,
		stock: false,
		waste: false,
		aces0: false,
		aces1: false,
		aces2: false,
		aces3: false,
		tableau0: false,
		tableau1: false,
		tableau2: false,
		tableau3: false,
		tableau4: false,
		tableau5: false,
		tableau6: false,
		backSelected: false
	};
	let passes: number = 0;

	const build = () => {
		for (let i = 0; i < 4; i++) aces[i] = [];
		for (let i = 0; i < 7; i++) tableau[i] = [];
		for (const key in flags) flags[key] = false;
		stack = [];
		waste = [];
		flags.backSelected = true;
	};

	const loadDeck = () => {
		deck = new Deck();
		handlers = {};
		for (let i = 0; i < deck.cards.length; i++) {
			card = deck.cards[i];
			handlers[card.id] = new cardHandler();
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

	const deal = () => {
		if (deck.cards.length !== 52) deck.build();
		deck.shuffle();
		for (const key in flags) flags[key] = false;
		passes = 0;
		for (let i = 0; i < 7; i++) {
			for (let j = i; j < 7; j++) {
				card = deck.draw();
				if (card) {
					if (i === j) card.facedown = false;
					tableau[j].push(card);
				}
			}
		}
		while ((card = deck.draw())) stack.push(card);
		for (const key in flags) flags[key] = true;
	};

	const selectBack = (event: any) => {
		const { back } = event.detail;
		flags.backSelected = false;
		deck.setBack(deck.backs.indexOf(back));
		deck.build();
		setTimeout(() => {
			flags.backSelected = true;
		}, 25);
	};

	onMount(() => {
		loadDeck();
		build();
	});
</script>

<div class="klondike-container">
	{#if flags.playing && deck.cards}
		<div class="klondike-top-row">
			<div class="klondike-top-left">
				<div class="card-container" id="stock" />
				<div class="card-container" id="waste" />
			</div>
			<div class="klondike-top-right">
				<div class="card-container" id="aces-0" />
				<div class="card-container" id="aces-1" />
				<div class="card-container" id="aces-2" />
				<div class="card-container" id="aces-3" />
			</div>
		</div>
		<div class="klondike-tableau">
			<div class="card-container" id="tableau-0" />
			<div class="card-container" id="tableau-1" />
			<div class="card-container" id="tableau-2" />
			<div class="card-container" id="tableau-3" />
			<div class="card-container" id="tableau-4" />
			<div class="card-container" id="tableau-5" />
			<div class="card-container" id="tableau-6" />
		</div>
	{:else}
		<h2>Select Card Back</h2>
		<div class="backs-wrap">
			{#if cardBacks.length && flags.backSelected}
				{#each cardBacks as back}
					<KlondikeBack {back} selected={deck.back} on:backClicked={selectBack} />
				{/each}
			{/if}
		</div>
		<div>
			<button on:click={deal}>Deal</button>
		</div>
	{/if}
</div>

<style>
	div.klondike-container {
		@apply mx-2 p-4 h-screen bg-green-600 rounded;
	}
	h2 {
		@apply text-lg font-bold mb-2;
	}
	div.backs-wrap {
		@apply flex flex-wrap justify-between mb-4 h-40;
	}
	button {
		@apply bg-white border border-black rounded py-1 px-2;
	}
	div.card-container {
		@apply w-28 h-36 p-0 border border-dashed border-yellow-300 rounded text-center relative;
	}
	div.klondike-top-row {
		@apply flex justify-between mb-4;
	}
	div.klondike-top-left {
		@apply flex flex-wrap;
	}
	div.klondike-top-left div.card-container {
		@apply mr-4;
	}
	div.klondike-top-right {
		@apply flex flex-wrap;
	}
	div.klondike-top-right div.card-container {
		@apply ml-4;
	}
	div.klondike-tableau {
		@apply flex flex-wrap justify-between;
	}
</style>
