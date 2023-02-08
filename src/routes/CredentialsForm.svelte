<script lang="ts">
	import type { ArgsUserCredential } from '../lib/types/args-user-credential.type';

	export let credentials: ArgsUserCredential;
</script>

<div class="credentials-form">
	<div class="field">
		<label for="user-name">User Name</label>
		<input type="text" name="user-name" id="user-name" bind:value={credentials.UserName} />
	</div>
	<div class="field">
		<label for="pass-word">PassWord</label>
		<input type="password" name="pass-word" id="pass-word" bind:value={credentials.PassWord} />
	</div>
</div>

<style>
	div.credentials-form {
		@apply px-2 py-1;
	}
	div.field {
		@apply border border-b-gray-500 border-dotted py-1;
	}
	label {
		@apply font-bold w-24 inline-block;
	}
	input {
		@apply border border-blue-800 rounded px-2 py-1 w-56;
	}
</style>
