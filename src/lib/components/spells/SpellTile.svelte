<script>
	import CopyIcon from '../CopyIcon.svelte';

	export let spell;
	export let onClick = (e) => {};
	export let buttonText;

	function copySpellText() {
		const spellText = `\n\n## ${spell.name || 'Unnamed Spell'}\n*Mana Cost:* ${spell['mana cost']}\n*Effect:* ${spell.effect}`;
		navigator.clipboard.writeText(spellText);
	}
</script>

<div class={`spell-container ${spell.type}-spell-type`}>
	<div>Spell Type: {spell['type'] ? spell['type'] : 'unknown'}</div>
	<div>Mana Cost: {spell['mana cost'] || '--'}</div>
	<div><span>Effect: </span>{spell.effect}</div>
	{#if buttonText}
		<input type="button" value={buttonText} on:click={onClick} />
	{/if}

	<div id="copyButton"><CopyIcon onClick={copySpellText} /></div>
</div>

<style>
	.spell-container {
		margin: 2rem auto;
		padding: 1rem 1rem 0 1rem;
		border: 1px solid black;
	}

	.Leveling-spell-type {
		background-color: #defeff;
	}

	.Combat-spell-type {
		background-color: #f7cdcd;
	}

	.Utility-spell-type {
		background-color: #facaf8;
	}

	.Healing-spell-type {
		background-color: #facaf8;
	}

	#copyButton {
		float: right;
	}
</style>
