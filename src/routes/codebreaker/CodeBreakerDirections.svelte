<script lang="ts">
	let visible: boolean = false;

	const toggleDirections = () => {
		const button = <HTMLButtonElement>document.getElementById('directions-toggle');
		if (button) {
			button.disabled = true;

			visible = !visible;

			const content = document.getElementById('code-breaker-directions-content');
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

<div class="code-breaker-directions">
	<div class="codebreaker-directions-title">
		<h2>
			<button id="directions-toggle" on:click={toggleDirections} class="directions-toggle"
				>Code Breaker Directions</button
			>
		</h2>
	</div>
	<div class="code-breaker-directions-content" id="code-breaker-directions-content">
		<h3>Directions</h3>
		<div class="mx-2 mb-2">
			Code breaker is based on the paper and pencil game known as <b>bulls and cows</b>. A
			commercial version was released as <b>Master Mind</b>. A player will guess what they believe
			the code to be and a number of black and white keys will be returned rating their guess. A
			black key indicates the correct color is in the correct position and a white key indicates a
			correct color in the wrong position. This version is set up as solitaire and allows selection
			of both the colors to be used and the number of columns in the code.
		</div>
		<h3>Scoring</h3>
		<div class="mx-2 mb-2">
			<ul>
				<li>
					<strong>Per Column</strong>
					10
				</li>
				<li>
					<strong>Per Color</strong>
					10
				</li>
				<li>
					<strong>Per Black Key</strong>
					10
				</li>
				<li>
					<strong>Per White Key</strong>
					5
				</li>
				<li>
					<strong>Max Guesses</strong>
					Number of columns * 2
				</li>
				<li>
					<strong>Per Guess</strong>
					Number of columns * per column
				</li>
				<li>
					<strong>Initial Max</strong>
					(max guesses * per guess) + (number of colors * per color)
				</li>
			</ul>
		</div>
		<div class="mx-2 mb-2">
			<div class="mb-2">
				Scoring will begin by calculating the initial max. Each turn taken will subtract the per
				guess amount and add the number of white and black keys returned. The faster a player
				arrives at the solution, the higher the score.
			</div>
			<div>
				Additional info about
				<a href="https://en.wikipedia.org/wiki/Bulls_and_Cows" target="_blank" rel="noreferrer"
					>Bulls and Cows</a
				>
				and
				<a
					href="https://en.wikipedia.org/wiki/Mastermind_(board_game)"
					target="_blank"
					rel="noreferrer">Master Mind</a
				>
			</div>
		</div>
	</div>
</div>

<style>
	div.code-breaker-directions {
		@apply mt-4;
	}
	div.code-breaker-directions-content {
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
