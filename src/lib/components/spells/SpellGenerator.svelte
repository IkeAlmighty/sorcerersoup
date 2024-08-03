<script>
	import SpellTile from '$lib/components/spells/SpellTile.svelte';
	import { expandAll } from '$lib/tools/ssslang';

	let inputString = `Eat a piece of $[cake; human flesh; lobster]. You gain the ability to $[see through walls; fly; temporarily shrink yourself for 5 minutes to any size].`;
	let outputData = [];
</script>

<div class="container">
	<textarea bind:value={inputString} placeholder="Input String" />
	<button disabled={inputString.length == 0} on:click={() => (outputData = expandAll(inputString))}
		>Generate</button
	>

	{#each outputData as spell}
		<SpellTile spell={{ effect: spell }} />
	{/each}
</div>

<style>
	.container {
		margin: auto auto;
		max-width: 400px;
	}
	textarea {
		width: 100%;
		height: 400px;
		padding: 1rem;
	}
</style>
