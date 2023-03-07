<script lang="ts">
	let visible: boolean = false;
	import ScoreGrid from './ScoreGrid.svelte';

	const toggleDirections = () => {
		const button = <HTMLButtonElement>document.getElementById('directions-toggle');
		if (button) {
			button.disabled = true;

			visible = !visible;

			const content = document.getElementById('ten-grand-directions-content');
			if (content) {
				const scrollH = content.scrollHeight;
				content.style.visibility = visible ? 'visible' : 'hidden';
				content.style.maxHeight = visible ? scrollH + 50 + 'px' : '0px';
				content.style.height = visible ? scrollH + 50 + 'px' : '0px';
			}

			setTimeout(() => {
				button.disabled = false;
			}, 150);
		}
	};
</script>

<div class="ten-grand-directions">
	<div class="ten-grand-directions-title">
		<h2>
			<button id="directions-toggle" on:click={toggleDirections} class="directions-toggle"
				>Ten Grand Directions</button
			>
		</h2>
	</div>
	<div class="ten-grand-directions-content" id="ten-grand-directions-content">
		<h3>Directions</h3>
		<div class="mx-2 mb-2">
			Ten Grand is a dice game where the goal is to score more than 10000 points. In each turn the
			player will roll 6 dice and attempt to receive some score for all of them. In fact if you do
			not score all 6 dice you crap out for the turn and receive a score of zero.
		</div>
		<div class="mx-2 mb-2">
			The scoring options include 3, 4, 5, or 6 of a kind, a straight of all 6 dices, three pairs,
			double 3 of a kind, and a full house. Both 1s and 5s are the only dice that can be scored
			individually. Some discrepacies were found in the scoring of larger items, the points used in
			this version are listed in the table below. Some versions allow progressively building larger
			items across multiple rolls, but that is not the case here. This version is designed as
			solitaire and the goal is to achieve 10000 points in the fewest amount of turns.
		</div>
		<div class="mx-2 mb-2">
			Additional info about <a
				href="https://en.wikipedia.org/wiki/Dice_10000"
				target="_blank"
				rel="noreferrer">Ten Grand</a
			>
		</div>
		<h3>Scoring</h3>
		<ScoreGrid />
	</div>
</div>

<style>
	div.ten-grand-directions {
		@apply mt-4;
	}
	div.ten-grand-directions-content {
		@apply h-0 max-h-0 overflow-hidden py-2 transition duration-500 ease-in-out invisible border border-blue-500 rounded mx-2 p-2 bg-white;
	}
	h2 {
		@apply text-lg font-bold mx-2 mb-2;
	}
	h3 {
		@apply text-base font-bold mx-2 mb-2;
	}
	button#directions-toggle {
		@apply w-full text-left  bg-blue-300 border-blue-600 border rounded px-2 py-1;
	}
	a {
		@apply font-bold text-blue-600 no-underline;
	}
	a:hover {
		@apply underline;
	}
</style>
