<script lang="ts">
	export let face: number = 1;

	let folder = '/dice';
	const src = `${folder}/dice-${face}.svg`;
	const alt = `Die ${face}`;
</script>

<div class="ten-grand-small-die" draggable="false">
	<img {src} {alt} class="w-6 h-6" draggable="false" />
</div>

<style>
	div.ten-grand-small-die {
		@apply bg-white w-6 h-6 p-0 rounded inline-block mr-1 py-1;
	}
</style>