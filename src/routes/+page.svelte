<script>
	let name;
	let gender;
	let age;
	let characterClass;
	let specialInterest;
	let specialInterestFillInBlank;

	let viceExplanation;
	let backstory;
	let secretConnection;

	let selectedVice;
	let vices = [
		'Gluttony',
		'Envy',
		'Anger',
		'Lust',
		'Sloth',
		'Alcohol',
		'Avarice',
		'Greed',
		'Pride',
		'Smoking',
		'Wrath',
		'Addiction',
		'Arrogance',
		'Corruption',
		'Gamblin’'
	];

	function selectClass(e) {
		characterClass = e.target.value;
	}

	function chooseAge() {
		age = Math.floor(Math.random() * 100) + 17;
	}

	function calcMana() {
		if (!characterClass) return 0;

		switch (characterClass) {
			case 'Artificer':
				return 75;
			case 'Priest':
				return 75;
			case 'Demigod':
				return 200;
			case 'Tinkermage':
				return 55;
			case 'Grunt':
				return 50;
			case 'Normie':
				return -300;
		}
	}

	function calcHealth() {
		if (!characterClass) return 0;

		switch (characterClass) {
			case 'Artificer':
				return 50;
			case 'Priest':
				return 50;
			case 'Demigod':
				return 35;
			case 'Tinkermage':
				return 50;
			case 'Grunt':
				return 60;
			case 'Normie':
				return 50;
		}
	}

	function copyCharacterToClipboard() {
		let character = `
## ${name}
Gender: ${gender}
Class: ${characterClass}\n
Current/Max Mana: \t\t / ${calcMana()}
Current/Max Health: \t\t / ${calcHealth()}\n
Special Interest: ${specialInterest}
Vice: ${selectedVice}
Explanation: \n${viceExplanation}\n
Backstory: \n${backstory}\n
Secret Connection: \n${secretConnection}\n
        `;

		navigator.clipboard
			.writeText(character)
			.then(() => alert('Character sheet copied to clipboard!'));
	}
</script>

<div class="container">
	<div><input type="text" bind:value={name} placeholder="write name here" /></div>
	<div><input type="text" bind:value={gender} placeholder="write gender here" /></div>
	<div class="mt-2">
		<b>AGE:</b>
		{#if !age}
			<input type="button" value={`Click to "Choose" Age`} on:click={chooseAge} />
		{:else}{age} years old.{/if}
	</div>
	<div class="mt-2">Choose a <b>CLASS</b>:</div>
	<div>
		<label>
			<input
				type="radio"
				name="chClass"
				checked={characterClass === 'Artificer'}
				value="Artificer"
				on:change={selectClass}
			/>
			<b>Artificer</b> (can inscribe glyphs on objects for any party member to use)
		</label>
		<label>
			<input
				type="radio"
				name="chClass"
				checked={characterClass === 'Demigod'}
				value="Demigod"
				on:change={selectClass}
			/>
			<b>Demigod</b> (starts with a massive mana pool and array of combat spells)
		</label>
		<label>
			<input
				type="radio"
				name="chClass"
				checked={characterClass === 'Tinkermage'}
				value="Tinkermage"
				on:change={selectClass}
			/>
			<b>Tinkermage</b> (can learn new spells quickly, but starts with a small mana pool)
		</label>
		<label>
			<input
				type="radio"
				name="chClass"
				checked={characterClass === 'Priest'}
				value="Priest"
				on:change={selectClass}
			/>
			<b>Priest</b> (starts with an array of healing spells and can communicate well with locals)
		</label>
		<label>
			<input
				type="radio"
				name="chClass"
				checked={characterClass === 'Grunt'}
				value="Grunt"
				on:change={selectClass}
			/>
			<b>Grunt</b> (is very physically capable)
		</label>
		<label>
			<input
				type="radio"
				name="chClass"
				checked={characterClass === 'Normie'}
				value="Normie"
				on:change={selectClass}
			/>
			<b>Normie</b> (Unable to vocalize spells or use mana… kinda useless? Idk why you chose this)
		</label>
	</div>

	<div class="mt-2">
		Pick a <b>SPECIAL INTEREST:</b>
		<label>
			<input
				type="radio"
				name="specialInterest"
				checked={specialInterest === 'Mushrooms'}
				value="Mushrooms"
				on:change={(e) => (specialInterest = e.target.value)}
			/>
			Mushrooms
		</label>

		<label>
			<input
				type="radio"
				name="specialInterest"
				checked={specialInterest === 'Trains'}
				value="Trains"
				on:change={(e) => (specialInterest = e.target.value)}
			/>
			Trains
		</label>

		<label>
			<input
				type="radio"
				name="specialInterest"
				checked={specialInterest === 'Frogs'}
				value="Frogs"
				on:change={(e) => (specialInterest = e.target.value)}
			/>
			Frogs
		</label>

		<label>
			<input
				type="radio"
				name="specialInterest"
				checked={specialInterest === specialInterestFillInBlank}
				value={specialInterestFillInBlank}
				on:change={(e) => (specialInterest = e.target.value)}
			/>

			<input
				type="text"
				bind:value={specialInterestFillInBlank}
				placeholder="(or fill in the blank)"
			/>
		</label>
	</div>

	<div class="mt-2">Choose a <b>VICE:</b></div>
	<div class="vice-container">
		{#each vices as vice}
			<div>
				<label>
					<input
						type="radio"
						value={vice}
						checked={selectedVice === vice}
						on:change={(e) => (selectedVice = e.target.value)}
					/>
					{vice}
				</label>
			</div>
		{/each}
	</div>

	<div class="my-2">Explain yourself:</div>
	<textarea style="min-height: 75px" bind:value={viceExplanation}></textarea>

	<div class="my-2">
		Write a short <b>BACKSTORY</b>, if you didn't already write a long one for the last question:
	</div>
	<textarea bind:value={backstory}></textarea>

	<div class="my-2">
		Choose another member of your party. Write down how you (your character, not you in real life)
		knows them, aka your <b>SECRET CONNECTION</b>. Maybe check in with that member, make sure your
		story makes sense and doesn’t offend them too much.
	</div>
	<textarea bind:value={secretConnection}></textarea>

	{#if name && gender && selectedVice && backstory && viceExplanation && characterClass && age && specialInterest && secretConnection}
		<div class="my-2">
			Please press the button to copy your character sheet to your clipboard. You can paste it in
			Discord for the gobblygook to go away:
		</div>

		<input
			type="button"
			value="Copy Character Sheet to Clipboard"
			on:click={copyCharacterToClipboard}
		/>
	{/if}
</div>

<style>
	label {
		display: block;
		margin: 0.5rem auto;
	}

	input {
		margin: 0.5rem auto;
		display: inline-block;
		padding: 0.5rem;
	}

	.vice-container {
		display: grid;
		grid-template-columns: 33% 33% 33%;
	}

	textarea {
		width: 100%;
		min-height: 175px;
	}
</style>
