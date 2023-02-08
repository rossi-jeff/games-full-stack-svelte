<script lang="ts">
	import type { ArgsUserCredential } from '../lib/types/args-user-credential.type';
	import CredentialsForm from './CredentialsForm.svelte';
	let register: ArgsUserCredential = {
		UserName: '',
		PassWord: ''
	};
	let signIn: ArgsUserCredential = {
		UserName: '',
		PassWord: ''
	};

	type LinkType = { url: string; name: string };
	const links: LinkType[] = [
		{ url: '/guessword', name: 'Guess Word' },
		{ url: '/hangman', name: 'Hang Man' },
		{ url: '/codebreaker', name: 'Code Breaker' },
		{ url: '/yacht', name: 'Yacht' },
		{ url: '/seabattle', name: 'Sea Battle' }
	];

	const openSignIn = () => {
		const modal = document.getElementById('modal');
		const dialog = document.getElementById('sign-in-dialog');
		if (modal && dialog) {
			dialog.style.display = 'block';
			modal.style.display = 'block';
		}
	};

	const closeSignIn = () => {
		const modal = document.getElementById('modal');
		const dialog = document.getElementById('sign-in-dialog');
		if (modal && dialog) {
			dialog.style.display = 'none';
			modal.style.display = 'none';
		}
	};

	const openRegister = () => {
		const modal = document.getElementById('modal');
		const dialog = document.getElementById('register-dialog');
		if (modal && dialog) {
			dialog.style.display = 'block';
			modal.style.display = 'block';
		}
	};

	const closeRegister = () => {
		const modal = document.getElementById('modal');
		const dialog = document.getElementById('register-dialog');
		if (modal && dialog) {
			dialog.style.display = 'none';
			modal.style.display = 'none';
		}
	};
</script>

<div class="nav-bar">
	<div class="left-side">
		<a href="/">Home</a>
		{#each links as link}
			<a href={link.url}>{link.name}</a>
		{/each}
	</div>
	<div class="right-side">
		<button on:click={openRegister}>Register</button>
		<button on:click={openSignIn}>Sign In</button>
	</div>
</div>

<div id="modal" class="modal-overlay">
	<!-- register dialog-->
	<div id="register-dialog">
		<div class="dialog-header">Register</div>
		<div class="dialog-content">
			<CredentialsForm bind:credentials={register} />
		</div>
		<div class="dialog-buttons">
			<button class="cancel" on:click={closeRegister}>Cancel</button>
			<button>Register</button>
		</div>
	</div>
	<!-- sign in dialog-->
	<div id="sign-in-dialog">
		<div class="dialog-header">Sign In</div>
		<div class="dialog-content">
			<CredentialsForm bind:credentials={signIn} />
		</div>
		<div class="dialog-buttons">
			<button class="cancel" on:click={closeSignIn}>Cancel</button>
			<button>Sign In</button>
		</div>
	</div>
</div>

<style>
	div.nav-bar {
		@apply flex flex-wrap mx-2 my-2 p-2 border border-blue-900 rounded bg-blue-400 justify-between;
	}
	div.left-side {
		@apply flex flex-wrap;
	}
	div.right-side {
		@apply text-right;
	}
	div.right-side button {
		@apply py-1 px-0 ml-2 font-bold text-sm;
	}
	a {
		@apply no-underline mr-4 font-bold;
	}
	a:hover {
		@apply underline text-white;
	}
	div.right-side button:hover {
		@apply text-white underline;
	}
	div.modal-overlay {
		@apply fixed hidden inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full;
	}
	div.dialog-header {
		@apply border bg-blue-800 border-blue-900 text-white rounded p-2;
	}
	div.dialog-content {
		@apply p-0 my-2 max-h-56 overflow-y-auto;
	}
	div.dialog-buttons {
		@apply p-2 flex justify-between;
	}
	div.dialog-buttons button {
		@apply border bg-blue-800 border-blue-900 text-white rounded p-2;
	}
	div.dialog-buttons button:hover {
		@apply bg-blue-700;
	}
	div.dialog-buttons button.cancel {
		@apply bg-gray-500;
	}
	div.dialog-buttons button.cancel:hover {
		@apply bg-gray-400;
	}
	div#sign-in-dialog {
		@apply hidden mx-auto relative w-96 bg-white p-4 rounded top-24;
	}
	div#register-dialog {
		@apply hidden mx-auto relative w-96 bg-white p-4 rounded top-24;
	}
</style>
