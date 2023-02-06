<script lang="ts">
	type LinkType = { url: string; name: string };
	const links: LinkType[] = [
		{ url: '/guessword', name: 'Guess Word' },
		{ url: '/hangman', name: 'Hang Man' },
		{ url: '/codebreaker', name: 'Code Breaker' },
		{ url: '/yacht', name: 'Yacht' },
		{ url: '/seabattle', name: 'Sea Battle' }
	];
</script>

<div class="nav-bar">
	<a href="/">Home</a>
	{#each links as link}
		<a href={link.url}>{link.name}</a>
	{/each}
</div>

<style>
	div.nav-bar {
		@apply flex flex-wrap mx-2 my-2 p-2 border border-blue-900 rounded bg-blue-400;
	}
	a {
		@apply no-underline mr-4 font-bold;
	}
	a:hover {
		@apply underline text-white;
	}
</style>
