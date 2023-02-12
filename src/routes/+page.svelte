<div class="content">
	<h3>Welcome Visitor</h3>
	<div>
		The pages of this site are a collection of games written in typescript. They have a MySQL
		backend and most calculations are performed on the server.
	</div>
	<div>
		The site itself was constructed using the following tools and resources:
		<ul>
			<li>
				<a href="https://kit.svelte.dev/">Svelte Kit</a> -
				<i
					>SvelteKit is built on Svelte, a UI framework that uses a compiler to let you write
					breathtakingly concise components that do minimal work in the browser, using languages you
					already know — HTML, CSS and JavaScript. It's a love letter to web development.</i
				> (site documentation)
			</li>
			<li>
				<a href="https://tailwindcss.com/">Tailwind CSS</a> -
				<i
					>A utility-first CSS framework packed with classes like flex, pt-4, text-center and
					rotate-90 that can be composed to build any design, directly in your markup.</i
				> (site documentation)
			</li>
			<li>Dice images downloaded from <a href="https://css.gg/">CSS.GG</a></li>
			<li>
				Additional SVG images were downloaded from <a href="https://feathericons.com/"
					>Feather Icons</a
				>
			</li>
		</ul>
	</div>
	<div>
		Take some time to play a few games and think about the problem solving skills involved in
		constucting them.
	</div>
	<div>
		The register and sign in dialogs serve two purposes:
		<ul>
			<li>proof of concept for user management</li>
			<li>scores will show a username rather than anonymous</li>
		</ul>
		No contact information is collected.
	</div>
	<div>The source code for the games site is available upon request.</div>
</div>

<style>
	div.content {
		@apply mx-2 my-2;
	}
	h3 {
		@apply font-bold text-lg mb-2;
	}
	div {
		@apply mb-4;
	}
	ul {
		@apply list-disc list-inside;
	}
	li {
		@apply ml-2;
	}
	a,
	a:visited {
		@apply text-blue-700 no-underline font-bold;
	}
	a:hover {
		@apply text-red-700 underline;
	}
</style>
