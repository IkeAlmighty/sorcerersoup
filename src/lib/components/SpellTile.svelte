<script>
	export let spell;
	export let onClick = (e) => {};
	export let buttonText;
</script>

<div class={`spell-container ${spell.type}-spell-type`}>
	<div>Spell Type: {spell['type']}</div>
	<div>Mana Cost: {spell['mana cost'] || '--'}</div>
	<div><span>Effect: </span>{spell.effect}</div>
	{#if buttonText}
		<input type="button" value={buttonText} on:click={onClick} />
	{/if}
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
</style>
