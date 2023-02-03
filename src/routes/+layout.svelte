<script>
	import '../app.postcss';
</script>

<div class="games">
	<div class="mb-2 ml-2">
		<a href="/">Home</a>
	</div>
	<slot />
</div>

<style>
	div.games {
		@apply m-0 p-2;
	}
</style>
