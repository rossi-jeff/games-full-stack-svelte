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
		<h3>Scoring</h3>
		<ScoreGrid />
	</div>
</div>

<style>
	div.ten-grand-directions {
		@apply mt-4;
	}
	div.ten-grand-directions-content {
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
</style>
