<script lang="ts">
	export let face: number = 1;
	let folder = '/dice';
	const src = `${folder}/dice-${face}.svg`;
	const alt = `Die ${face}`;
</script>

<img {src} {alt} class="w-16 h-16" />
