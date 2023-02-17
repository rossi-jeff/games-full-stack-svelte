<script lang="ts">
	import { onMount } from 'svelte';
	import { Deck, type Card } from '../../lib/deck';
	import type { FlagType } from '../../lib/types/flag.type';
	import FreeCellCard from './FreeCellCard.svelte';

	let free: { [key: number]: Card[] } = {};
	let aces: { [key: number]: Card[] } = {};
	let tableau: { [key: number]: Card[] } = {};

	let deck: Deck;
	let card: Card | undefined;

	let flags: FlagType = {
		free0: false,
		free1: false,
		free2: false,
		free3: false,
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
		tableau7: false
	};

	let acesDroppable: string[] = ['aces-0', 'aces-1', 'aces-2', 'aces-3'];
	let tableauDroppable: string[] = [
		'tableau-0',
		'tableau-1',
		'tableau-2',
		'tableau-3',
		'tableau-4',
		'tableau-5',
		'tableau-6',
		'tableau-7'
	];
	let freeDroppable: string[] = ['free-0', 'free-1', 'free-2', 'free-3'];
	let droppable: string[] = [...acesDroppable, ...tableauDroppable, ...freeDroppable];

	const build = () => {
		for (let i = 0; i < 4; i++) {
			aces[i] = [];
			free[i] = [];
		}
		for (let i = 0; i < 8; i++) tableau[i] = [];
		for (const key in flags) flags[key] = false;
	};

	const loadDeck = () => {
		deck = new Deck();
		preload();
	};

	const preload = () => {
		let images = [];
		let idx = 0;
		for (const card of deck.cards) {
			images[idx] = new Image();
			images[idx].src = card.src;
			idx++;
		}
	};

	const deal = () => {
		if (deck.cards.length !== 52) {
			deck.build();
			build();
		}
		deck.shuffle();
		for (const key in flags) flags[key] = false;
		let idx = 0;
		while ((card = deck.draw())) {
			if (card) {
				card.facedown = false;
				tableau[idx].push(card);
			}
			idx++;
			if (idx > 7) idx = 0;
		}
		adjustDraggable();
		setTimeout(() => {
			for (const key in flags) flags[key] = true;
		}, 25);
	};

	const adjustDraggable = () => {
		for (const key in free) {
			for (let i = 0; i < free[key].length; i++) free[key][i].draggable = true;
		}
		for (const key in aces) {
			for (let i = 0; i < aces[key].length; i++) aces[key][i].draggable = false;
		}
		let dragDisabled: boolean,
			previous: Card | undefined,
			current: Card | undefined,
			idxP: number,
			idxC: number;
		for (const key in tableau) {
			dragDisabled = false;
			previous = undefined;
			current = undefined;
			for (let i = tableau[key].length - 1; i >= 0; i--) {
				current = tableau[key][i];
				if (dragDisabled) {
					tableau[key][i].draggable = false;
				} else if (previous) {
					idxC = deck.faces.indexOf(current.face);
					idxP = deck.faces.indexOf(previous.face);
					if (deck.color(current) !== deck.color(previous) && idxC === idxP + 1) {
						tableau[key][i].draggable = true;
					} else {
						tableau[key][i].draggable = false;
						dragDisabled = true;
					}
				} else {
					tableau[key][i].draggable = true;
				}
				previous = current;
			}
		}
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
			let classSet = false;
			while (!classSet) {
				if (target.classList.contains('card-container')) {
					target.classList.add('over');
					classSet = true;
					setTimeout(() => {
						target.classList.remove('over');
					}, 750);
				} else if (target.parentElement) {
					target = target.parentElement;
				} else {
					classSet = true;
				}
			}
		}
	};

	const dragExit = (event: any) => {
		let { target } = event;
		if (target) {
			let classSet = false;
			while (!classSet) {
				if (target.classList.contains('over')) {
					target.classList.remove('over');
				} else if (target.parentElement) {
					target = target.parentElement;
				} else {
					classSet = true;
				}
			}
		}
	};

	const drop = (event: any) => {
		event.preventDefault();
		event.stopPropagation();
		const data = event.dataTransfer.getData('text');
		const [from, cardId] = data.split('_');
		const dropTarget = event.target ? event.target.id : null;
		const to = getTo(dropTarget);
		moveCard(to, from, cardId);
	};

	const moveCard = (to: string, from: string, cardId: string) => {
		if (!to || to === from) return;
		const lastCard = getLastCard(to);
		const droppedCard = getDroppedCard(from, cardId);
		if (!droppedCard) return;
		if (canDropCard(to, droppedCard, lastCard) && enoughFreeSpace(to, from, cardId)) {
			completeMove(to, from, cardId);
		} else return;
	};

	const completeMove = (to: string, from: string, cardId: string) => {
		let cardIdInt = parseInt(cardId);
		const toMove: Card[] = [];
		let found = false;
		switch (from) {
			case 'free-0':
				flags.free0 = false;
				while (!found) {
					card = free[0].pop();
					if (card) {
						toMove.push(card);
						if (card.id === cardIdInt) found = true;
					} else found = true;
				}
				adjustDraggable();
				setTimeout(() => {
					flags.free0 = true;
				}, 25);
				break;
			case 'free-1':
				flags.free1 = false;
				while (!found) {
					card = free[1].pop();
					if (card) {
						toMove.push(card);
						if (card.id === cardIdInt) found = true;
					} else found = true;
				}
				adjustDraggable();
				setTimeout(() => {
					flags.free1 = true;
				}, 25);
				break;
			case 'free-2':
				flags.free2 = false;
				while (!found) {
					card = free[2].pop();
					if (card) {
						toMove.push(card);
						if (card.id === cardIdInt) found = true;
					} else found = true;
				}
				adjustDraggable();
				setTimeout(() => {
					flags.free2 = true;
				}, 25);
				break;
			case 'free-3':
				flags.free3 = false;
				while (!found) {
					card = free[3].pop();
					if (card) {
						toMove.push(card);
						if (card.id === cardIdInt) found = true;
					} else found = true;
				}
				adjustDraggable();
				setTimeout(() => {
					flags.free3 = true;
				}, 25);
				break;
			case 'tableau-0':
				flags.tableau0 = false;
				while (!found) {
					card = tableau[0].pop();
					if (card) {
						toMove.push(card);
						if (card.id === cardIdInt) found = true;
					} else found = true;
				}
				adjustDraggable();
				setTimeout(() => {
					flags.tableau0 = true;
				}, 25);
				break;
			case 'tableau-1':
				flags.tableau1 = false;
				while (!found) {
					card = tableau[1].pop();
					if (card) {
						toMove.push(card);
						if (card.id === cardIdInt) found = true;
					} else found = true;
				}
				adjustDraggable();
				setTimeout(() => {
					flags.tableau1 = true;
				}, 25);
				break;
			case 'tableau-2':
				flags.tableau2 = false;
				while (!found) {
					card = tableau[2].pop();
					if (card) {
						toMove.push(card);
						if (card.id === cardIdInt) found = true;
					} else found = true;
				}
				adjustDraggable();
				setTimeout(() => {
					flags.tableau2 = true;
				}, 25);
				break;
			case 'tableau-3':
				flags.tableau3 = false;
				while (!found) {
					card = tableau[3].pop();
					if (card) {
						toMove.push(card);
						if (card.id === cardIdInt) found = true;
					} else found = true;
				}
				adjustDraggable();
				setTimeout(() => {
					flags.tableau3 = true;
				}, 25);
				break;
			case 'tableau-4':
				flags.tableau4 = false;
				while (!found) {
					card = tableau[4].pop();
					if (card) {
						toMove.push(card);
						if (card.id === cardIdInt) found = true;
					} else found = true;
				}
				adjustDraggable();
				setTimeout(() => {
					flags.tableau4 = true;
				}, 25);
				break;
			case 'tableau-5':
				flags.tableau5 = false;
				while (!found) {
					card = tableau[5].pop();
					if (card) {
						toMove.push(card);
						if (card.id === cardIdInt) found = true;
					} else found = true;
				}
				adjustDraggable();
				setTimeout(() => {
					flags.tableau5 = true;
				}, 25);
				break;
			case 'tableau-6':
				flags.tableau6 = false;
				while (!found) {
					card = tableau[6].pop();
					if (card) {
						toMove.push(card);
						if (card.id === cardIdInt) found = true;
					} else found = true;
				}
				adjustDraggable();
				setTimeout(() => {
					flags.tableau6 = true;
				}, 25);
				break;
			case 'tableau-7':
				flags.tableau7 = false;
				while (!found) {
					card = tableau[7].pop();
					if (card) {
						toMove.push(card);
						if (card.id === cardIdInt) found = true;
					} else found = true;
				}
				adjustDraggable();
				setTimeout(() => {
					flags.tableau7 = true;
				}, 25);
				break;
		}
		switch (to) {
			case 'free-0':
				flags.free0 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) {
						free[0].push(card);
					}
				}
				adjustDraggable();
				setTimeout(() => {
					flags.free0 = true;
				}, 25);
				break;
			case 'free-1':
				flags.free1 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) {
						free[1].push(card);
					}
				}
				adjustDraggable();
				setTimeout(() => {
					flags.free1 = true;
				}, 25);
				break;
			case 'free-2':
				flags.free2 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) {
						free[2].push(card);
					}
				}
				adjustDraggable();
				setTimeout(() => {
					flags.free2 = true;
				}, 25);
				break;
			case 'free-3':
				flags.free3 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) {
						free[3].push(card);
					}
				}
				adjustDraggable();
				setTimeout(() => {
					flags.free3 = true;
				}, 25);
				break;
			case 'tableau-0':
				flags.tableau0 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) tableau[0].push(card);
				}
				adjustDraggable();
				setTimeout(() => {
					flags.tableau0 = true;
				}, 25);
				break;
			case 'tableau-1':
				flags.tableau1 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) tableau[1].push(card);
				}
				adjustDraggable();
				setTimeout(() => {
					flags.tableau1 = true;
				}, 25);
				break;
			case 'tableau-2':
				flags.tableau2 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) tableau[2].push(card);
				}
				adjustDraggable();
				setTimeout(() => {
					flags.tableau2 = true;
				}, 25);
				break;
			case 'tableau-3':
				flags.tableau3 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) tableau[3].push(card);
				}
				adjustDraggable();
				setTimeout(() => {
					flags.tableau3 = true;
				}, 25);
				break;
			case 'tableau-4':
				flags.tableau4 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) tableau[4].push(card);
				}
				adjustDraggable();
				setTimeout(() => {
					flags.tableau4 = true;
				}, 25);
				break;
			case 'tableau-5':
				flags.tableau5 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) tableau[5].push(card);
				}
				adjustDraggable();
				setTimeout(() => {
					flags.tableau5 = true;
				}, 25);
				break;
			case 'tableau-6':
				flags.tableau6 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) tableau[6].push(card);
				}
				adjustDraggable();
				setTimeout(() => {
					flags.tableau6 = true;
				}, 25);
				break;
			case 'tableau-7':
				flags.tableau7 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) tableau[7].push(card);
				}
				adjustDraggable();
				setTimeout(() => {
					flags.tableau7 = true;
				}, 25);
				break;
			case 'aces-0':
				flags.aces0 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) {
						card.draggable = false;
						aces[0].push(card);
					}
				}
				adjustDraggable();
				setTimeout(() => {
					flags.aces0 = true;
				}, 25);
				break;
			case 'aces-1':
				flags.aces1 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) {
						card.draggable = false;
						aces[1].push(card);
					}
				}
				adjustDraggable();
				setTimeout(() => {
					flags.aces1 = true;
				}, 25);
				break;
			case 'aces-2':
				flags.aces2 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) {
						card.draggable = false;
						aces[2].push(card);
					}
				}
				adjustDraggable();
				setTimeout(() => {
					flags.aces2 = true;
				}, 25);
				break;
			case 'aces-3':
				flags.aces3 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) {
						card.draggable = false;
						aces[3].push(card);
					}
				}
				adjustDraggable();
				setTimeout(() => {
					flags.aces3 = true;
				}, 25);
				break;
		}
	};

	const canDropCard = (to: string, droppedCard: Card, lastCard: Card | undefined) => {
		let idxL: number, idxD: number;
		if (freeDroppable.includes(to)) {
			return lastCard ? false : true;
		} else if (acesDroppable.includes(to)) {
			if (lastCard && lastCard.suit !== droppedCard.suit) return false;
			if (!lastCard && droppedCard.face === 'ace') return true;
			if (lastCard) {
				idxL = deck.faces.indexOf(lastCard.face);
				idxD = deck.faces.indexOf(droppedCard.face);
				return lastCard.suit === droppedCard.suit && idxD === idxL + 1;
			} else return false;
		} else if (tableauDroppable.includes(to)) {
			if (lastCard && deck.color(lastCard) === deck.color(droppedCard)) return false;
			if (lastCard) {
				idxL = deck.faces.indexOf(lastCard.face);
				idxD = deck.faces.indexOf(droppedCard.face);
				return deck.color(lastCard) !== deck.color(droppedCard) && idxL === idxD + 1;
			} else return true;
		} else return false;
	};

	const enoughFreeSpace = (to: string, from: string, cardId: string) => {
		let cardIdInt = parseInt(cardId);
		let moveQty = 0;
		switch (from) {
			case 'tableau-0':
				for (let i = tableau[0].length - 1; i >= 0; i--) {
					moveQty++;
					if (tableau[0][i].id === cardIdInt) break;
				}
				break;
			case 'tableau-1':
				for (let i = tableau[1].length - 1; i >= 0; i--) {
					moveQty++;
					if (tableau[1][i].id === cardIdInt) break;
				}
				break;
			case 'tableau-2':
				for (let i = tableau[2].length - 1; i >= 0; i--) {
					moveQty++;
					if (tableau[2][i].id === cardIdInt) break;
				}
				break;
			case 'tableau-3':
				for (let i = tableau[3].length - 1; i >= 0; i--) {
					moveQty++;
					if (tableau[3][i].id === cardIdInt) break;
				}
				break;
			case 'tableau-4':
				for (let i = tableau[4].length - 1; i >= 0; i--) {
					moveQty++;
					if (tableau[4][i].id === cardIdInt) break;
				}
				break;
			case 'tableau-5':
				for (let i = tableau[5].length - 1; i >= 0; i--) {
					moveQty++;
					if (tableau[5][i].id === cardIdInt) break;
				}
				break;
			case 'tableau-6':
				for (let i = tableau[6].length - 1; i >= 0; i--) {
					moveQty++;
					if (tableau[6][i].id === cardIdInt) break;
				}
				break;
			case 'tableau-7':
				for (let i = tableau[7].length - 1; i >= 0; i--) {
					moveQty++;
					if (tableau[7][i].id === cardIdInt) break;
				}
				break;
			case 'free-0':
				for (let i = free[0].length - 1; i >= 0; i--) {
					moveQty++;
					if (free[0][i].id === cardIdInt) break;
				}
				break;
			case 'free-1':
				for (let i = free[1].length - 1; i >= 0; i--) {
					moveQty++;
					if (free[1][i].id === cardIdInt) break;
				}
				break;
			case 'free-2':
				for (let i = free[2].length - 1; i >= 0; i--) {
					moveQty++;
					if (free[2][i].id === cardIdInt) break;
				}
				break;
			case 'free-3':
				for (let i = free[3].length - 1; i >= 0; i--) {
					moveQty++;
					if (free[3][i].id === cardIdInt) break;
				}
				break;
		}
		if (moveQty < 2) return true;
		if (moveQty > 1 && (freeDroppable.includes(to) || acesDroppable.includes(to))) return false;
		let emptyFree = 0;
		let emptyTableau = 0;
		for (const key in free) if (!free[key].length) emptyFree++;
		for (const key in tableau) if (!tableau[key].length) emptyTableau++;
		return moveQty <= emptyTableau * emptyFree + emptyFree + 1;
	};

	const getLastCard = (to: string) => {
		let lastCard: Card | undefined;
		switch (to) {
			case 'free-0':
				lastCard = free[0].length ? free[0][free[0].length - 1] : undefined;
				break;
			case 'free-1':
				lastCard = free[1].length ? free[1][free[1].length - 1] : undefined;
				break;
			case 'free-2':
				lastCard = free[2].length ? free[2][free[2].length - 1] : undefined;
				break;
			case 'free-3':
				lastCard = free[3].length ? free[3][free[3].length - 1] : undefined;
				break;
			case 'aces-0':
				lastCard = aces[0].length ? aces[0][aces[0].length - 1] : undefined;
				break;
			case 'aces-1':
				lastCard = aces[1].length ? aces[1][aces[1].length - 1] : undefined;
				break;
			case 'aces-2':
				lastCard = aces[2].length ? aces[2][aces[2].length - 1] : undefined;
				break;
			case 'aces-3':
				lastCard = aces[3].length ? aces[3][aces[3].length - 1] : undefined;
				break;
			case 'tableau-0':
				lastCard = tableau[0].length ? tableau[0][tableau[0].length - 1] : undefined;
				break;
			case 'tableau-1':
				lastCard = tableau[1].length ? tableau[1][tableau[1].length - 1] : undefined;
				break;
			case 'tableau-2':
				lastCard = tableau[2].length ? tableau[2][tableau[2].length - 1] : undefined;
				break;
			case 'tableau-3':
				lastCard = tableau[3].length ? tableau[3][tableau[3].length - 1] : undefined;
				break;
			case 'tableau-4':
				lastCard = tableau[4].length ? tableau[4][tableau[4].length - 1] : undefined;
				break;
			case 'tableau-5':
				lastCard = tableau[5].length ? tableau[5][tableau[5].length - 1] : undefined;
				break;
			case 'tableau-6':
				lastCard = tableau[6].length ? tableau[6][tableau[6].length - 1] : undefined;
				break;
			case 'tableau-7':
				lastCard = tableau[7].length ? tableau[7][tableau[7].length - 1] : undefined;
				break;
		}
		return lastCard;
	};

	const getDroppedCard = (from: string, cardId: string) => {
		let droppedCard: Card | undefined;
		switch (from) {
			case 'free-0':
				droppedCard = free[0].find((c) => c.id === parseInt(cardId));
				break;
			case 'free-1':
				droppedCard = free[1].find((c) => c.id === parseInt(cardId));
				break;
			case 'free-2':
				droppedCard = free[2].find((c) => c.id === parseInt(cardId));
				break;
			case 'free-3':
				droppedCard = free[3].find((c) => c.id === parseInt(cardId));
				break;
			case 'tableau-0':
				droppedCard = tableau[0].find((c) => c.id === parseInt(cardId));
				break;
			case 'tableau-1':
				droppedCard = tableau[1].find((c) => c.id === parseInt(cardId));
				break;
			case 'tableau-2':
				droppedCard = tableau[2].find((c) => c.id === parseInt(cardId));
				break;
			case 'tableau-3':
				droppedCard = tableau[3].find((c) => c.id === parseInt(cardId));
				break;
			case 'tableau-4':
				droppedCard = tableau[4].find((c) => c.id === parseInt(cardId));
				break;
			case 'tableau-5':
				droppedCard = tableau[5].find((c) => c.id === parseInt(cardId));
				break;
			case 'tableau-6':
				droppedCard = tableau[6].find((c) => c.id === parseInt(cardId));
				break;
			case 'tableau-7':
				droppedCard = tableau[7].find((c) => c.id === parseInt(cardId));
				break;
		}
		return droppedCard;
	};

	const getTo = (dropTarget: string | null) => {
		if (!dropTarget) return '';
		let el = document.getElementById(dropTarget);
		if (el) {
			let found = false;
			while (!found) {
				if (el.classList.contains('card-container')) {
					found = true;
				} else if (el && el.parentNode) {
					el = el.parentNode;
				} else {
					found = true;
				}
			}
			return el ? el.id : '';
		} else {
			return '';
		}
	};

	onMount(() => {
		loadDeck();
		build();
	});
</script>

<div class="free-cell-container">
	<button on:click={deal} class="mb-2 ml-2">New Deal</button>
	<div class="free-cell-top-row">
		<div class="free-cell-free">
			<div
				class="card-container"
				id="free-0"
				on:dragover={dragOver}
				on:dragenter={dragEnter}
				on:dragleave={dragExit}
				on:drop={drop}
			>
				{#if flags.free0}
					{#each free[0] as card}
						<FreeCellCard {card} level={0} from="free-0" on:dragStart={dragStart} />
					{/each}
				{/if}
			</div>
			<div
				class="card-container"
				id="free-1"
				on:dragover={dragOver}
				on:dragenter={dragEnter}
				on:dragleave={dragExit}
				on:drop={drop}
			>
				{#if flags.free1}
					{#each free[1] as card}
						<FreeCellCard {card} level={0} from="free-1" on:dragStart={dragStart} />
					{/each}
				{/if}
			</div>
			<div
				class="card-container"
				id="free-2"
				on:dragover={dragOver}
				on:dragenter={dragEnter}
				on:dragleave={dragExit}
				on:drop={drop}
			>
				{#if flags.free2}
					{#each free[2] as card}
						<FreeCellCard {card} level={0} from="free-2" on:dragStart={dragStart} />
					{/each}
				{/if}
			</div>
			<div
				class="card-container"
				id="free-3"
				on:dragover={dragOver}
				on:dragenter={dragEnter}
				on:dragleave={dragExit}
				on:drop={drop}
			>
				{#if flags.free3}
					{#each free[3] as card}
						<FreeCellCard {card} level={0} from="free-3" on:dragStart={dragStart} />
					{/each}
				{/if}
			</div>
		</div>
		<div class="free-cell-aces">
			<div
				class="card-container"
				id="aces-0"
				on:dragover={dragOver}
				on:dragenter={dragEnter}
				on:dragleave={dragExit}
				on:drop={drop}
			>
				{#if flags.aces0}
					{#each aces[0] as card}
						<FreeCellCard {card} level={0} from="aces-0" />
					{/each}
				{/if}
			</div>
			<div
				class="card-container"
				id="aces-1"
				on:dragover={dragOver}
				on:dragenter={dragEnter}
				on:dragleave={dragExit}
				on:drop={drop}
			>
				{#if flags.aces1}
					{#each aces[1] as card}
						<FreeCellCard {card} level={0} from="aces-1" />
					{/each}
				{/if}
			</div>
			<div
				class="card-container"
				id="aces-2"
				on:dragover={dragOver}
				on:dragenter={dragEnter}
				on:dragleave={dragExit}
				on:drop={drop}
			>
				{#if flags.aces2}
					{#each aces[2] as card}
						<FreeCellCard {card} level={0} from="aces-2" />
					{/each}
				{/if}
			</div>
			<div
				class="card-container"
				id="aces-3"
				on:dragover={dragOver}
				on:dragenter={dragEnter}
				on:dragleave={dragExit}
				on:drop={drop}
			>
				{#if flags.aces3}
					{#each aces[3] as card}
						<FreeCellCard {card} level={0} from="aces-3" />
					{/each}
				{/if}
			</div>
		</div>
	</div>
	<div class="free-cell-tableau">
		<div
			class="card-container"
			id="tableau-0"
			on:dragover={dragOver}
			on:dragenter={dragEnter}
			on:dragleave={dragExit}
			on:drop={drop}
		>
			{#if flags.tableau0}
				{#each tableau[0] as card, level}
					<FreeCellCard {card} {level} from="tableau-0" on:dragStart={dragStart} />
				{/each}
			{/if}
		</div>
		<div
			class="card-container"
			id="tableau-1"
			on:dragover={dragOver}
			on:dragenter={dragEnter}
			on:dragleave={dragExit}
			on:drop={drop}
		>
			{#if flags.tableau1}
				{#each tableau[1] as card, level}
					<FreeCellCard {card} {level} from="tableau-1" on:dragStart={dragStart} />
				{/each}
			{/if}
		</div>
		<div
			class="card-container"
			id="tableau-2"
			on:dragover={dragOver}
			on:dragenter={dragEnter}
			on:dragleave={dragExit}
			on:drop={drop}
		>
			{#if flags.tableau2}
				{#each tableau[2] as card, level}
					<FreeCellCard {card} {level} from="tableau-2" on:dragStart={dragStart} />
				{/each}
			{/if}
		</div>
		<div
			class="card-container"
			id="tableau-3"
			on:dragover={dragOver}
			on:dragenter={dragEnter}
			on:dragleave={dragExit}
			on:drop={drop}
		>
			{#if flags.tableau3}
				{#each tableau[3] as card, level}
					<FreeCellCard {card} {level} from="tableau-3" on:dragStart={dragStart} />
				{/each}
			{/if}
		</div>
		<div
			class="card-container"
			id="tableau-4"
			on:dragover={dragOver}
			on:dragenter={dragEnter}
			on:dragleave={dragExit}
			on:drop={drop}
		>
			{#if flags.tableau4}
				{#each tableau[4] as card, level}
					<FreeCellCard {card} {level} from="tableau-4" on:dragStart={dragStart} />
				{/each}
			{/if}
		</div>
		<div
			class="card-container"
			id="tableau-5"
			on:dragover={dragOver}
			on:dragenter={dragEnter}
			on:dragleave={dragExit}
			on:drop={drop}
		>
			{#if flags.tableau5}
				{#each tableau[5] as card, level}
					<FreeCellCard {card} {level} from="tableau-5" on:dragStart={dragStart} />
				{/each}
			{/if}
		</div>
		<div
			class="card-container"
			id="tableau-6"
			on:dragover={dragOver}
			on:dragenter={dragEnter}
			on:dragleave={dragExit}
			on:drop={drop}
		>
			{#if flags.tableau6}
				{#each tableau[6] as card, level}
					<FreeCellCard {card} {level} from="tableau-6" on:dragStart={dragStart} />
				{/each}
			{/if}
		</div>
		<div
			class="card-container"
			id="tableau-7"
			on:dragover={dragOver}
			on:dragenter={dragEnter}
			on:dragleave={dragExit}
			on:drop={drop}
		>
			{#if flags.tableau7}
				{#each tableau[7] as card, level}
					<FreeCellCard {card} {level} from="tableau-7" on:dragStart={dragStart} />
				{/each}
			{/if}
		</div>
	</div>
</div>

<style>
	div.free-cell-container {
		@apply mx-2 p-4 h-screen bg-green-600 rounded;
	}
	div.card-container {
		@apply w-28 h-36 p-0 border border-dashed border-yellow-300 rounded text-center relative;
	}
	div.free-cell-top-row,
	div.free-cell-tableau {
		@apply flex flex-wrap justify-between mx-2 mb-4;
	}
	div.free-cell-free,
	div.free-cell-aces {
		@apply flex flex-wrap;
	}
	div.free-cell-free div.card-container {
		@apply mr-4;
	}
	div.free-cell-aces div.card-container {
		@apply ml-4;
	}
	button {
		@apply bg-white border border-black rounded py-1 px-2;
	}
	:global(div.card-container.over) {
		border: dashed red !important;
	}
</style>
