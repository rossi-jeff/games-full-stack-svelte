<script lang="ts">
	let visible: boolean = false;

	const toggleDirections = () => {
		const button = <HTMLButtonElement>document.getElementById('directions-toggle');
		if (button) {
			button.disabled = true;

			visible = !visible;

			const content = document.getElementById('concentration-directions-content');
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

<div class="concentration-directions">
	<div class="concentration-directions-title">
		<h2>
			<button id="directions-toggle" on:click={toggleDirections} class="directions-toggle"
				>Concentration Directions</button
			>
		</h2>
	</div>
	<div class="concentration-directions-content" id="concentration-directions-content">
		<h3>Directions</h3>
		<div class="mx-2 mb-2">
			A standard deck of 52 cards is shuffled and placed face down. The player will click two cards
			to flip them over. If the cards have the same face they are removed. Other variants require
			matching both the face and the color. If the cards do not match they are turned face down
			again and the player will turn over to more cards.
		</div>
		<div class="mx-2 mb-2">Play will continuue until all cards have been removed.</div>
		<div class="mx-2 mb-2">
			Additional info about <a
				href="https://en.wikipedia.org/wiki/Concentration_(card_game)"
				target="_blank"
				rel="noreferrer">Concentration</a
			>
		</div>
		<h3>Scoring</h3>
		<div class="mx-2 mb-2">
			This version is designed as solitaire and the goal is to complete in the shortest time.
		</div>
	</div>
</div>

<style>
	div.concentration-directions {
		@apply mt-4;
	}
	div.concentration-directions-content {
		@apply h-0 max-h-0 overflow-hidden py-2 transition duration-500 ease-in-out invisible border border-blue-500 rounded mx-2 p-2;
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
