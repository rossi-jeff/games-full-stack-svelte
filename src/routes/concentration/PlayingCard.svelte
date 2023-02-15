<script lang="ts">
	import type { Card } from '$lib/deck';

	export let card: Card;
	export let idx: number;
	let facedown: boolean = true;

	export const flip = () => {
		facedown = !facedown;
		const img = <HTMLImageElement>document.getElementById(`card-${idx}`);
		if (img) img.src = facedown ? card.backSrc : card.src;
	};

	export const hide = () => {
		const img = <HTMLImageElement>document.getElementById(`card-${idx}`);
		if (img) {
			img.style.visibility = 'hidden';
		}
	};

	export const show = () => {
		const img = <HTMLImageElement>document.getElementById(`card-${idx}`);
		if (img) {
			img.style.visibility = 'visible';
		}
	};
</script>

<div class="playing-card-wrapper" on:click={flip} on:keydown={flip}>
	<img src={card.backSrc} alt="card-{idx}" class="playing-card" id="card-{idx}" />
</div>

<style>
	div.playing-card-wrapper {
		@apply w-24 h-32 mr-2 mb-2 p-0;
	}
	img.playing-card {
		@apply w-24 h-32 cursor-pointer;
	}
</style>
