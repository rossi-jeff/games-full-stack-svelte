<script lang="ts">
	let visible: boolean = false;

	const toggleDirections = () => {
		const button = <HTMLButtonElement>document.getElementById('directions-toggle');
		if (button) {
			button.disabled = true;

			visible = !visible;

			const content = document.getElementById('guess-word-directions-content');
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

<div class="guess-word-directions">
	<div class="guess-word-directions-title">
		<h2>
			<button id="directions-toggle" on:click={toggleDirections} class="directions-toggle"
				>Guess Word Directions</button
			>
		</h2>
	</div>
	<div class="guess-word-directions-content" id="guess-word-directions-content">
		<h3>Directions</h3>
		<div class="mx-2 mb-2">
			Guess word is based on the pencil and paper word game <b>Jotto</b> along with some ideas from
			the popular word game <b>Wordle</b>. This version is designed to be played as solitaire, and
			allows selection of the word length.
		</div>
		<h3>Scoring</h3>
		<div class="mx-2 mb-2">
			<ul>
				<li>
					<strong>Per Green</strong>
					10
				</li>
				<li>
					<strong>Per Brown</strong>
					5
				</li>
				<li>
					<strong>Per Letter</strong>
					10
				</li>
				<li>
					<strong>Per Guess</strong>
					Word length * per letter
				</li>
				<li>
					<strong>Max Guesses</strong>
					(word length * 3) / 2 rounded up
				</li>
				<li>
					<strong>Initial Max</strong>
					max guesses * per guess
				</li>
			</ul>
			<div class="mb-2">
				Scoring will begin by calculating the initial max. Each turn taken will subtract the per
				guess amount and add the number of green and brown ratings returned. The faster a player
				arrives at the solution, the higher the score.
			</div>
			<div>
				Additional info about
				<a href="https://en.wikipedia.org/wiki/Jotto" target="_blank" rel="noreferrer">Jotto</a>
				and
				<a href="https://en.wikipedia.org/wiki/Wordle" target="_blank" rel="noreferrer">Wordle</a>
			</div>
		</div>
	</div>
</div>

<style>
	div.guess-word-directions {
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
	ul {
		@apply list-disc list-inside mb-2;
	}
	li {
		@apply ml-2;
	}
	div.guess-word-directions-content {
		@apply h-0 max-h-0 overflow-hidden py-2 transition duration-500 ease-in-out invisible border border-blue-500 rounded mx-2 p-2 bg-white;
	}
	a {
		@apply font-bold text-blue-600 no-underline;
	}
	a:hover {
		@apply underline;
	}
</style>
