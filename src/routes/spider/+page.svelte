<script lang="ts">
	import { type Card, Deck } from '$lib/deck';
	import { onMount } from 'svelte';
	import SpiderCard from './SpiderCard.svelte';
	import type { FlagType } from '$lib/types/flag.type';

	let aces: { [key: number]: Card[] } = {};
	let tableau: { [key: number]: Card[] } = {};
	let stock: Card[];
	let deck: Deck;
	const count = {
		tableau: 10,
		aces: 8
	};
	const flags: FlagType = {
		aces: true,
		tableau: true,
		stock: true
	};
	let timeout: ReturnType<typeof setTimeout> | undefined;

	const setup = () => {
		flags.aces = false;
		flags.tableau = false;
		for (let t = 0; t < count.tableau; t++) tableau[t] = [];
		for (let a = 0; a < count.aces; a++) aces[a] = [];
		stock = [];
		deck = new Deck(2);
		setTimeout(() => {
			flags.aces = true;
			flags.tableau = true;
		}, 0);
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
		setup();
		deck.shuffle();
		let idx = 0;
		let counter = 0;
		let length: number;
		flags.tableau = false;
		flags.stock = false;
		while (counter < 54) {
			const card = deck.draw();
			if (card) {
				tableau[idx].push(card);
				counter++;
				idx++;
				if (idx >= count.tableau) idx = 0;
			}
		}
		while (deck.cards.length) {
			const card = deck.draw();
			if (card) {
				card.clickable = true;
				stock.push(card);
			}
		}
		for (let t = 0; t < count.tableau; t++) {
			length = tableau[t] ? tableau[t].length : 0;
			const card = length > 0 ? tableau[t][length - 1] : undefined;
			if (card) {
				card.facedown = false;
				card.draggable = true;
			}
		}
		setTimeout(() => {
			flags.tableau = true;
			flags.stock = true;
		}, 0);
	};

	const dragStart = (event: any) => {
		event.preventDefault();
		if (event.target) event.dataTransfer.setData('text', event.target.id);
		else if (event.detail) event.detail.dataTransfer.setData('text', event.detail.target.id);
	};

	const dragOver = (event: any) => {
		event.preventDefault();
	};

	const dragEnter = (event: any) => {
		let { target } = event;
		if (target) {
			while (!target.classList.contains('card-container')) target = target.parentElement;
			target.classList.add('over');
			setTimeout(() => {
				target.classList.remove('over');
			}, 500);
		}
	};

	const drop = (event: any) => {
		event.preventDefault();
		event.stopPropagation();
		const data = event.dataTransfer.getData('text');
		let [from, cardId] = data.split('_');
		cardId = parseInt(cardId);
		let to = '';
		let { target } = event;
		if (target) {
			while (!target.classList.contains('card-container')) target = target.parentElement;
			to = target.id;
		}
		if (canDrop(from, cardId, to)) moveCards(from, cardId, to);
	};

	const canDrop = (from: string, cardId: number, to: string) => {
		const topCard = getTopCard(to);
		if (!topCard) return true;
		const { card: draggedCard } = getDraggedCard(from, cardId);
		if (!draggedCard) return false;
		if (deck.faces.indexOf(topCard.face) == deck.faces.indexOf(draggedCard.face) + 1) return true;
		return false;
	};

	const moveCards = (from: string, cardId: number, to: string) => {
		const [_1, idxF] = from.split('-');
		const [_2, idxT] = to.split('-');
		const toMove: Card[] = [];
		let card: Card | undefined;
		if (tableau[parseInt(idxF)].length) {
			let found = false;
			while (!found && tableau[parseInt(idxF)].length) {
				card = tableau[parseInt(idxF)].pop();
				if (card) {
					toMove.push(card);
					if (card.id == cardId) found = true;
				}
			}
		}
		if (toMove.length) {
			while (toMove.length) {
				card = toMove.pop();
				if (card) tableau[parseInt(idxT)].push(card);
			}
		}
		adjustDraggable();
	};

	const getTopCard = (to: string) => {
		let card: Card | undefined;
		const [_, idx] = to.split('-');
		if (tableau[parseInt(idx)] && tableau[parseInt(idx)].length) {
			card = tableau[parseInt(idx)][tableau[parseInt(idx)].length - 1];
		}
		return card;
	};

	const getDraggedCard = (from: string, cardId: number) => {
		let card: Card | undefined;
		const [_, idx] = from.split('-');
		let idxC = -1,
			length = 1,
			qty = 0;
		if (tableau[parseInt(idx)] && tableau[parseInt(idx)].length) {
			length = tableau[parseInt(idx)].length;
			idxC = tableau[parseInt(idx)].findIndex((c) => c.id == cardId);
			if (idxC != -1) {
				card = tableau[parseInt(idx)][idxC];
				qty = length - idxC;
			}
		}
		return { card, qty };
	};

	const adjustDraggable = () => {
		let current: Card | undefined, previous: Card | undefined;
		flags.tableau = false;
		for (let t = 0; t < count.tableau; t++) {
			if (tableau[t].length) {
				for (const card of tableau[t]) card.draggable = false;
				previous = tableau[t][tableau[t].length - 1];
				previous.draggable = true;
				previous.facedown = false;
				if (tableau[t].length > 1) {
					for (let i = tableau[t].length - 2; i >= 0; i--) {
						current = tableau[t][i];
						if (current.suit != previous.suit) break;
						if (deck.faces.indexOf(current.face) != deck.faces.indexOf(previous.face) + 1) break;
						current.draggable = true;
						previous = current;
					}
				}
			}
		}
		moveCompleteSuits();
		setTimeout(() => {
			flags.tableau = true;
		}, 0);
	};

	const moveCompleteSuits = () => {
		flags.aces = false;
		flags.tableau = false;
		let current: Card | undefined, previous: Card | undefined, counter: number;
		let toMove: Card[] = [];
		for (let t = 0; t < count.tableau; t++) {
			if (tableau[t].length >= 13) {
				previous = tableau[t][tableau[t].length - 1];
				counter = 1;
				toMove = [];
				if (previous.face == 'ace') {
					for (let i = tableau[t].length - 2; i >= 0; i--) {
						current = tableau[t][i];
						if (current.suit != previous.suit) break;
						if (deck.faces.indexOf(current.face) != deck.faces.indexOf(previous.face) + 1) break;
						counter++;
					}
				}
				if (counter == 13) {
					while (toMove.length < 13) {
						const card = tableau[t].pop();
						if (card) toMove.push(card);
					}
					for (let a = 0; a < count.aces; a++) {
						if (aces[a].length == 0) {
							while (toMove.length) {
								const card = toMove.pop();
								if (card) aces[a].push(card);
							}
							break;
						}
					}
				}
			}
		}
		setTimeout(() => {
			flags.aces = true;
			flags.tableau = true;
		}, 0);
	};

	const stockClicked = (event: any) => {
		if (timeout) clearTimeout(timeout);
		const { from } = event.detail;
		if (from === 'stock') {
			timeout = setTimeout(() => {
				let card: Card | undefined;
				for (let t = 0; t < count.tableau; t++) {
					card = stock.pop();
					if (card) {
						card.facedown = false;
						card.clickable = false;
						card.draggable = true;
						tableau[t].push(card);
					} else break;
				}
				for (let s = 0; s < stock.length; s++) stock[s].clickable = true;
				adjustDraggable();
			}, 150);
		}
	};

	onMount(() => {
		setup();
		preload();
	});
</script>

<div class="spider-container">
	<button on:click={deal}>Deal</button>
	<div id="spider-top-row" class="flex flex-wrap justify-between mb-4 mx-4">
		<div id="stock" class="card-container">
			{#if flags.stock && stock}
				{#each stock as card}
					<SpiderCard {card} level={0} from="stock" on:cardClicked={stockClicked} />
				{/each}
			{/if}
		</div>
		<div class="flex flex-wrap">
			{#each Array(count.aces) as _, idx}
				<div class="card-container ml-4" id="aces-{idx}">
					{#if flags.aces && aces[idx]}
						{#each aces[idx] as card}
							<SpiderCard {card} from="aces-{idx}" level={0} />
						{/each}
					{/if}
				</div>
			{/each}
		</div>
	</div>
	<div id="spider-tableau" class="flex flex-wrap justify-between mx-4">
		{#each Array(count.tableau) as _, idx}
			<div
				class="card-container"
				id="tableau-{idx}"
				on:dragover={dragOver}
				on:dragenter={dragEnter}
				on:drop={drop}
			>
				{#if flags.tableau && tableau[idx]}
					{#each tableau[idx] as card, level}
						<SpiderCard {card} from="tableau-{idx}" {level} on:dragStart={dragStart} />
					{/each}
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	div.card-container {
		@apply w-28 h-36 p-0 border border-dashed border-yellow-300 rounded text-center relative;
	}
	:global(div.over) {
		@apply border-red-500;
	}
</style>
