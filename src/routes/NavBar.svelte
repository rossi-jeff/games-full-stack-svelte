<script lang="ts">
	import type { ArgsUserCredential } from '../lib/types/args-user-credential.type';
	import CredentialsForm from './CredentialsForm.svelte';
	import { page } from '$app/stores';
	import { blankUserSession, userSession, type UserSessionData } from '$lib/user-session.writable';
	import { get } from 'svelte/store';
	import UserPlus from './UserPlus.svelte';
	import LogIn from './LogIn.svelte';
	import LogOut from './LogOut.svelte';

	let credentials: ArgsUserCredential = {
		UserName: '',
		PassWord: ''
	};

	type LinkType = { url: string; name: string };
	const links: LinkType[] = [
		{ url: '/guessword', name: 'Guess Word' },
		{ url: '/hangman', name: 'Hang Man' },
		{ url: '/codebreaker', name: 'Code Breaker' },
		{ url: '/yacht', name: 'Yacht' },
		{ url: '/seabattle', name: 'Sea Battle' },
		{ url: '/concentration', name: 'Concentration' }
	];

	let session: UserSessionData = get(userSession);

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

	const signIn = async () => {
		if (!credentials.UserName || !credentials.UserName) return alert('Please enter fields');
		try {
			const result = await fetch('/api/user/signin', {
				method: 'POST',
				body: JSON.stringify(credentials)
			});
			if (result.ok) {
				const { UserName, Token } = await result.json();
				userSession.set({
					UserName,
					Token,
					SignedIn: true
				});
				session = get(userSession);
				closeSignIn();
				credentials.PassWord = '';
			}
		} catch (error) {
			console.log(error);
		}
	};

	const signOut = () => {
		userSession.set(blankUserSession);
		session = get(userSession);
	};

	const register = async () => {
		if (!credentials.UserName || !credentials.UserName) return alert('Please enter fields');
		try {
			const result = await fetch('/api/user/register', {
				method: 'POST',
				body: JSON.stringify(credentials)
			});
			if (result.ok) {
				await result.json();
				closeRegister();
				signIn();
			}
		} catch (error) {
			console.log(error);
		}
	};
</script>

<div class="nav-bar">
	<div class="left-side">
		<a href="/" class:active={$page.url.pathname === '/'}>Home</a>
		{#each links as link}
			<a href={link.url} class:active={$page.url.pathname.includes(link.url)}>{link.name}</a>
		{/each}
	</div>
	<div class="right-side">
		{#if session && session.SignedIn}
			{session.UserName}
			<button on:click={signOut}>
				Sign Out
				<LogOut />
			</button>
		{:else}
			<button on:click={openRegister}>
				<UserPlus />
				Register
			</button>
			<button on:click={openSignIn}>
				Sign In
				<LogIn />
			</button>
		{/if}
	</div>
</div>

<div id="modal" class="modal-overlay">
	<!-- register dialog-->
	<div id="register-dialog">
		<div class="dialog-header">Register</div>
		<div class="dialog-content">
			<CredentialsForm bind:credentials />
		</div>
		<div class="dialog-buttons">
			<button class="cancel" on:click={closeRegister}>Cancel</button>
			<button on:click={register}>Register</button>
		</div>
	</div>
	<!-- sign in dialog-->
	<div id="sign-in-dialog">
		<div class="dialog-header">Sign In</div>
		<div class="dialog-content">
			<CredentialsForm bind:credentials />
		</div>
		<div class="dialog-buttons">
			<button class="cancel" on:click={closeSignIn}>Cancel</button>
			<button on:click={signIn}>Sign In</button>
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
		@apply text-right flex;
	}
	div.right-side button {
		@apply py-1 px-0 ml-2 font-bold text-sm flex;
	}
	a {
		@apply no-underline mr-2 font-bold py-1 px-1;
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
	:global(div.nav-bar a.active) {
		@apply bg-blue-900 rounded text-white;
	}
</style>
