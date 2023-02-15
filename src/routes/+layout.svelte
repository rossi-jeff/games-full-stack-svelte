<script>
	import '../app.postcss';
	import Footer from './Footer.svelte';
	import NavBar from './NavBar.svelte';
</script>

<div class="layout-container">
	<div class="header">
		<NavBar />
	</div>
	<div class="content">
		<slot />
		<div class="spacer" />
	</div>
	<div class="footer">
		<Footer />
	</div>
</div>

<style>
	div.layout-container {
		@apply flex flex-col h-screen max-h-screen overflow-hidden;
	}
	div.content {
		@apply flex-1 overflow-y-scroll;
	}
	div.spacer {
		@apply h-16;
	}
</style>
