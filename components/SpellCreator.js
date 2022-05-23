import CollectionSearchBox from "./CollectionSearchBox";

import { useState, useEffect, useRef } from "react";
import Spell from "./Spell";

import { calculateRollModifier } from "../lib/gameutilities";
import TagAdderField from "./TagAdderField";
import FancyRadioSelect from "./FancyRadioSelect";

export default function SpellCreator() {
  const [searchSelection, setSearchSelection] = useState(undefined);

  const [name, setName] = useState("");
  const [tier, setTier] = useState(5);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);

  const [doesDamage, setDoesDamage] = useState(false);
  const [doesHeal, setDoesHeal] = useState(false);
  const [doesHp, setDoesHp] = useState(false);

  const [validOnItems, setValidOnItems] = useState(true);

  const [spellDoc, setSpellDoc] = useState({});

  useEffect(createAndSetSpellDoc, [
    doesDamage,
    doesHeal,
    doesHp,
    name,
    description,
    tier,
  ]);

  function createAndSetSpellDoc() {
    // calculate combat damange based on tier
    const combatModifier = doesDamage ? calculateRollModifier(tier) : undefined;
    const healingModifier = doesHeal ? calculateRollModifier(tier) : undefined;
    const hpModifier = doesHp ? calculateRollModifier(tier) : undefined;

    const _spellDoc = {
      combatModifier,
      healingModifier,
      hpModifier,
      name,
      validOnItems,
      tier,
      description,
      tags,
    };

    setSpellDoc({ ..._spellDoc });
  }

  async function createSpell() {
    // TODO: Since we are not using default behavior for the form,
    // we need to manually check to see if the user filled out
    // all the required fields, and then send them an error
    // message and abort here if not

    // hit up api to create the item
    const apiCreateSpellResponse = await fetch("/api/spells/create", {
      method: "POST",
      body: JSON.stringify(spellDoc),
    });

    // let user know if any errors occured on backend
    if (apiCreateSpellResponse.status !== 200) {
      // const text = await apiCreateSpellResponse.text();
      alert(`SERVER ERROR`);
    }
  }

  return (
    <div className="p-3 max-w-md">
      <CollectionSearchBox
        label="Search Spells"
        collection="spells"
        onSelect={setSearchSelection}
      />

      <h1 className="my-3">Create a Spell</h1>
      <hr />

      {/* 'form' for creating the spell: */}
      <form onSubmit={(e) => e.preventDefault()} className="my-6">
        {/* Spell Name */}
        <div className="my-20">
          <label>
            <div className="my-3">Spell Name</div>
            <input
              className="w-full p-2 border"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>

        {/* combat flag */}
        <div className="my-10">
          <label>
            <input
              className="mr-3"
              type="checkbox"
              value={doesDamage}
              onChange={(e) => setDoesDamage(!doesDamage)}
            />
            <span>This is a damage spell</span>
          </label>
        </div>

        {/* Does Healing Flag */}
        <div className="my-10">
          <label>
            <input
              className="mr-3"
              type="checkbox"
              value={doesHeal}
              onChange={(e) => setDoesHeal(!doesHeal)}
            />
            <span>This is a healing spell</span>
          </label>
        </div>

        {/* Adds Base HP Flag */}
        <div className="my-10">
          <label>
            <input
              className="mr-3"
              type="checkbox"
              value={doesHp}
              onChange={(e) => setDoesHp(!doesHp)}
            />
            <span>This spell modifies HP</span>
          </label>
        </div>

        {/* Valid on Items*/}
        <div className="my-10">
          <label>
            <input
              className="mr-3"
              type="checkbox"
              value={validOnItems}
              onChange={(e) => setValidOnItems(e.target.value)}
            />
            <span>This spell can be attached to items</span>
          </label>
        </div>

        {/* Spell Tier */}
        <div className="my-20">
          <label>
            <div className="my-3">
              Spell Tier&nbsp;
              <div className="text-xs">
                Spell damage for combat spells will be automatically assigned
                based on tier.
              </div>
            </div>
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
          </label>
        </div>

        {/* Spell Description */}
        <div className="my-20">
          <label>
            <div className="mt-10 mb-6">
              What this spell does&nbsp;
              <div className="text-xs">
                Note: This is <b>JUST</b> the description, additional effects,
                and/or prerequisites for the spell to be cast. Combat, healing,
                and HP modifiers are automatically calculated and displayed
                seperately.
              </div>
            </div>
            <textarea
              className="w-full p-3 h-[200px] border"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
        </div>

        {/* Tags */}
        <div className="my-20">
          <TagAdderField
            tags={tags}
            onAddition={(newTags) =>
              setTags(Array.from(new Set([...newTags, ...tags])))
            }
            onRemoval={(removedTag) =>
              setTags(tags.filter((t) => t !== removedTag))
            }
          />
        </div>

        {/* Spell Preview */}
        <div className="my-20 mx-auto">
          <h2>Preview: </h2>
          <Spell spellData={spellDoc} />
        </div>

        <div className="my-20 px-auto text-center">
          <button type="button" onClick={() => createSpell()}>
            Create Spell
          </button>
        </div>
      </form>
    </div>
  );
}
