import { useEffect, useState } from "react";
import CharacterInventory from "./Character/CharacterInventory";
import CharacterName from "./Character/CharacterName";
import CharacterSpells from "./Character/CharacterSpells";
import FancyRadioSelect from "./FancyRadioSelect";
import Item from "./Item";

// similar to Character class, but is automatically associated with a game terminal
// and is only used for creating characters in the global database, no socketio
export default function CharacterCreator({ onCreate, gameData }) {
  const [name, setName] = useState("");
  const [inventory, setInventory] = useState([]);
  const [spells, setSpells] = useState([]);
  const [tier, setTier] = useState(5); // 1 - 7 (1 is strongest)

  async function fetchAndSetRandomName() {
    const randomNameAPIResponse = await fetch("/api/random/characterName");
    const randomName = await randomNameAPIResponse.text();

    setName(randomName);
  }

  async function fetchAndSetRandomSpells() {
    const limit = 6 - tier >= 1 ? 7 - tier : 1; // tier 1 gets 5 items, descends from there
    const apiRandomSpellResponse = await fetch(
      `/api/spells/random?limit=${limit}&tier=${tier}`
    );
    const randomSpells = await apiRandomSpellResponse.json();
    setSpells(randomSpells);
  }

  async function fetchAndSetRandomInventory() {
    const limit = 6 - tier >= 1 ? 7 - tier : 1; // tier 1 gets 5 items, descends from there
    const apiRandomInventoryResponse = await fetch(
      `/api/items/random?limit=${limit}&tier=${tier}`
    );
    const randomInventory = await apiRandomInventoryResponse.json();
    setInventory(randomInventory);
  }

  return (
    <div>
      <div className="inline-block max-w-lg mx-auto">
        <CharacterName value={name} onChange={(newName) => setName(newName)} />
        <div
          className="inline-block cursor-pointer text-sm text-blue-600 select-none"
          onClick={() => fetchAndSetRandomName()}
        >
          Randomize Name
        </div>

        <div className="my-6">
          <span>Tier:</span>
          <FancyRadioSelect
            options={[
              { value: 1 },
              { value: 2 },
              { value: 3 },
              { value: 4 },
              { value: 5 },
              { value: 6 },
              { value: 7 },
            ]}
            onSelect={(val) => setTier(val)}
          />
          <div className="text-sm">( highest tier is 1 )</div>
        </div>

        {/* flag for randomly generated inventory */}
        <div className="mt-6">
          <h3>Inventory</h3>
          <div>
            <span
              className="text-sm cursor-pointer text-blue-600"
              onClick={() => fetchAndSetRandomInventory()}
            >
              Reroll Inventory
            </span>
          </div>

          <CharacterInventory
            inventory={inventory}
            onChange={(newInventory) => setInventory(newInventory)}
          />
        </div>

        {/* Flag for randomly generated spells */}
        <div className="my-6">
          <h3>Spells</h3>
          <div>
            <span
              className="text-sm cursor-pointer text-blue-600"
              onClick={() => fetchAndSetRandomSpells()}
            >
              Reroll Spells
            </span>
          </div>

          <CharacterSpells
            spells={spells}
            onChange={(newSpells) => setSpells(newSpells)}
          />
        </div>

        <button type="button" onClick={() => onCreate(characterDoc)}>
          Create Character
        </button>
      </div>
    </div>
  );
}
