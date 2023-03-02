<script lang="ts">
	let visible: boolean = false;

	const toggleDirections = () => {
		const button = <HTMLButtonElement>document.getElementById('directions-toggle');
		if (button) {
			button.disabled = true;

			visible = !visible;

			const content = document.getElementById('hang-man-directions-content');
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

<div class="hang-man-directions">
	<div class="hang-man-directions-title">
		<h2>
			<button id="directions-toggle" on:click={toggleDirections} class="directions-toggle"
				>Hang Man Directions</button
			>
		</h2>
	</div>
	<div class="hang-man-directions-content" id="hang-man-directions-content">
		<h3>Directions</h3>
		<div class="mx-2 mb-2">
			The player will guess letters sequentially until either the word is guessed or enough wrong
			guesses are made to lose the game.
		</div>
		<h3>Scoring</h3>
		<div class="mx-2 mb-2">
			<div class="mb-2">
				<ul>
					<li>
						<strong>Per Distict Letter</strong>
						10
					</li>
					<li>
						<strong>Per Correct</strong>
						5
					</li>
					<li>
						<strong>Per Wrong</strong>
						-10
					</li>
					<li>
						<strong>Initial if Won</strong>
						Number of distict letters * per distict letter
					</li>
				</ul>
			</div>
			<div class="mb-2">
				Scoring will begin with either the initial or zero depending upon game status. The score
				will be adjusted according to the quantity of letters correct and wrong.
			</div>
			<div>
				Additional info about <a
					href="https://en.wikipedia.org/wiki/Hangman_(game)"
					target="_blank"
					rel="noreferrer">Hang Man</a
				>
			</div>
		</div>
	</div>
</div>

<style>
	div.hang-man-directions {
		@apply mt-4;
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
	div.hang-man-directions-content {
		@apply h-0 max-h-0 overflow-hidden py-2 transition duration-500 ease-in-out invisible border border-blue-500 rounded mx-2 p-2 bg-white;
	}
	ul {
		@apply list-disc list-inside;
	}
	li {
		@apply ml-2;
	}
	a {
		@apply font-bold text-blue-600 no-underline;
	}
	a:hover {
		@apply underline;
	}
</style>
