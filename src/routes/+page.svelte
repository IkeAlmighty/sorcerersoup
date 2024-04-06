<script>
	export let data;

	let filteredData = [];
	let tiersSelected = { 3: true, 2: false, 1: false, S: false };
	let searchBarValue;

	let randomSpells = [];

	filterSpells();

	function toggleTiersSelectedAndFilter(tierToggles) {
		// toggle checkbox if this function was triggered by clicking one:
		tierToggles.forEach((tier) => (tiersSelected[tier] = !tiersSelected[tier]));
		filterSpells();
	}

	function filterSpellsByTier() {
		let filtered = data.data.filter((spell) => {
			function determineSpellTier(s) {
				let manaCost = s['mana cost'];
				if (!manaCost) return 'S';
				else if (manaCost < 50) return 3;
				else if (manaCost < 75) return 2;
				else if (manaCost < 150) return 1;
				else return 'S';
			}

			let tier = determineSpellTier(spell);
			return tiersSelected[tier];
		});

		return filtered;
	}

	function filterSpellsBySearchbar() {
		// if the searchbar is empty, then reset the list and return
		if (!searchBarValue || searchBarValue.length === 0) return data.data;

		//start out with all spells
		let filtered = data.data;
		let words = searchBarValue.toLowerCase();

		//filter out spells that don't have a word match
		filtered = data.data.filter((spell) => {
			let keywords = JSON.stringify(spell).toLowerCase();
			return keywords.includes(words);
		});

		return filtered;
	}

	function filterSpells() {
		let filteredBySearchBar = filterSpellsBySearchbar();
		let filteredByTier = filterSpellsByTier();

		filteredData = [];

		filteredBySearchBar.forEach((searchBarSpell) => {
			filteredByTier.forEach((tierSpell) => {
				if (searchBarSpell === tierSpell) filteredData.push(searchBarSpell);
			});
		});
	}

	function addRandomSpell() {
		let newSpell = filteredData[Math.floor(Math.random() * filteredData.length)];
		if (randomSpells.includes(newSpell)) return;
		randomSpells = [...randomSpells, newSpell];
	}

	function removeSpellFromRandomSpells(spell) {
		randomSpells = randomSpells.filter((s) => s !== spell);
	}
</script>

<div class="container">
	<div class="center">
		<input
			type="text"
			placeholder="Search Here"
			bind:value={searchBarValue}
			on:input={() => filterSpells()}
		/>
		<br />

		<label>
			<input
				type="checkbox"
				name="tier"
				checked={tiersSelected[3]}
				on:click={(e) => toggleTiersSelectedAndFilter([3])}
			/>
			Tier 3
		</label>
		<label>
			<input
				type="checkbox"
				name="tier"
				checked={tiersSelected[2]}
				on:click={(e) => toggleTiersSelectedAndFilter([2])}
			/>
			Tier 2
		</label>
		<label>
			<input
				type="checkbox"
				name="tier"
				checked={tiersSelected[1]}
				on:click={(e) => toggleTiersSelectedAndFilter([1])}
			/>
			Tier 1
		</label>
		<label>
			<input
				type="checkbox"
				name="tier"
				checked={tiersSelected['S']}
				on:click={(e) => toggleTiersSelectedAndFilter(['S'])}
			/>
			Tier S
		</label>

		<div>
			<input type="button" value="Pick a Random Spell" on:click={addRandomSpell} />
			{#if randomSpells.length > 0}
				<input type="button" value="Clear" on:click={(e) => (randomSpells = [])} />
			{/if}
		</div>
	</div>

	{#if randomSpells.length > 0}
		<div>Random Spell Set:</div>
		<hr />
	{/if}
	{#each randomSpells as spell}
		<div class={`spell-container ${spell.type}-spell-type`}>
			<div>Spell Type: {spell['type']}</div>
			<div>Mana Cost: {spell['mana cost'] || '--'}</div>
			<div><span>Effect: </span>{spell.effect}</div>
			<input type="button" value="remove" on:click={() => removeSpellFromRandomSpells(spell)} />
		</div>
	{/each}

	{#if randomSpells.length === 0}
		<div>Search Results:</div>
		<hr />
		{#each filteredData as spell}
			<div class={`spell-container ${spell.type}-spell-type`}>
				<div>Spell Type: {spell['type']}</div>
				<div>Mana Cost: {spell['mana cost'] || '--'}</div>
				<div><span>Effect: </span>{spell.effect}</div>
				<input
					type="button"
					value="Start Random Set"
					on:click={() => (randomSpells = [...randomSpells, spell])}
				/>
			</div>
		{/each}
	{/if}
</div>

<style>
	input[type='text'] {
		display: block;
		padding: 0.5rem;
		width: 90%;
		border: 1px solid black;
		border-radius: 10px;
		text-align: center;
		margin: auto auto;
	}

	input[type='button'] {
		margin: 1rem auto;
		padding: 0.5rem;
	}

	.center {
		text-align: center;
	}

	.spell-container {
		margin: 2rem auto;
		padding: 1rem 1rem 0 1rem;
		border: 1px solid black;
	}

	.container {
		max-width: 412px;
		margin: auto auto;
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
