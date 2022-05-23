import { useState, useEffect } from "react";
import CollectionSearchBox from "./CollectionSearchBox";
import Spell from "./Spell";
import Item from "./Item";
import { calculateRollModifier } from "../lib/gameutilities";
import TagAdderField from "./TagAdderField";

export default function ItemCreator() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tier, setTier] = useState(5);
  const [attachedSpells, setAttachedSpells] = useState([]); // use can optionally edit this, or let it be filled based on tier
  const [tags, setTags] = useState([]);
  const [allowedSpellTags, setAllowedSpellTags] = useState([]);

  const [doesDamage, setDoesDamage] = useState(false);
  const [doesHeal, setDoesHeal] = useState(false);
  const [doesHp, setDoesHp] = useState(false);

  const [hasCustomSpells, setHasCustomSpells] = useState(false);
  const [customSpells, setCustomSpells] = useState([]);
  const [randomSpells, setRandomSpells] = useState([]);

  const [itemDoc, setItemDoc] = useState({});

  useEffect(createAndSetItemDocument, [
    name,
    description,
    tier,
    attachedSpells,
    hasCustomSpells,
    doesDamage,
    tags,
    allowedSpellTags,
  ]);

  // this effect updates the actual attached spells
  // whenever "Custom Spells" is toggled
  // .. it switches between the randomly generated
  // and the custom added spells
  useEffect(() => {
    if (hasCustomSpells) setAttachedSpells(customSpells);
    else setAttachedSpells(randomSpells);
  }, [hasCustomSpells, randomSpells, customSpells]);

  // this effect updates the random spells
  // whenever tier or allowedSpellTags change or the page loads
  useEffect(() => {
    async function fetchAndSetRandomSpells() {
      const numberOfSpells = 6 - tier > 0 ? 6 - tier : 0;

      const apiRandomSpellResponse = await fetch(
        `/api/spells/random?tags=${JSON.stringify(
          allowedSpellTags
        )}&limit=${numberOfSpells}`
      );

      const _randomSpells = await apiRandomSpellResponse.json();

      setRandomSpells(_randomSpells);
    }
    fetchAndSetRandomSpells();
  }, [tier, allowedSpellTags]);

  function createAndSetItemDocument() {
    const combatModifier = doesDamage ? calculateRollModifier(tier) : undefined;
    const healingModifier = doesHeal ? calculateRollModifier(tier) : undefined;
    const hpModifier = doesHp ? calculateRollModifier(tier) : undefined;

    const _itemDoc = {
      name,
      description,
      tier,
      attachedSpells,
      combatModifier,
      hpModifier,
      healingModifier,
      tags,
      allowedSpellTags,
    };

    setItemDoc({ ..._itemDoc });
  }

  async function createItem() {
    // TODO: don't allow user to create items
    // that are not fully filled out with relevant data

    const document = JSON.stringify(itemDoc);
    const apiCreateItemResponse = await fetch(`/api/items/create`, {
      method: "POST",
      body: document,
    });

    if (!apiCreateItemResponse.status === 200) {
      alert("SREVER ERROR");
    }

    // TODO: clear all fields
  }

  return (
    <div className="max-w-md p-3">
      <h1>Create an Item</h1>

      {/* 'form' for creating and item */}
      <div className="my-10">
        <label>
          <div>Name</div>
          <input
            className="p-2 block border mt-3 mb-10 w-full"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          <div className="">Description: </div>
          <input
            className="p-2 block border mt-3 mb-10 w-full"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        {/* combat flag */}
        <div className="my-10">
          <label>
            <input
              className="mr-3"
              type="checkbox"
              value={doesDamage}
              onChange={(e) => setDoesDamage(!doesDamage)}
            />
            <span>This item deals damage</span>
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
            <span>This item heals</span>
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
            <span>This item modifies HP</span>
          </label>
        </div>

        <div className="my-10">
          <span className="mr-3">Tier</span>
          <select
            className="w-1/2 float-right"
            onChange={(e) => setTier(e.target.value)}
            value={tier}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((t) => (
              <option key={`tier-${t}`} value={t}>
                &nbsp;{t}&nbsp;
                {t === 1 ? "(Most Powerful)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="my-10">
          <label>
            <input
              type="checkbox"
              onChange={() => setHasCustomSpells(!hasCustomSpells)}
            />
            <span className="ml-3">Custom Spells</span>
          </label>
        </div>

        {!hasCustomSpells && (
          <div className="mt-5 mb-10">
            <div>Only Allow Spells with these Tags:</div>
            <TagAdderField
              tags={allowedSpellTags}
              onAddition={(newTags) =>
                setAllowedSpellTags(
                  Array.from(new Set([...newTags, ...allowedSpellTags]))
                )
              }
              onRemoval={(removedTag) =>
                setAllowedSpellTags(
                  allowedSpellTags.filter((t) => t !== removedTag)
                )
              }
            />
          </div>
        )}

        {hasCustomSpells && (
          <div className="my-10">
            <CollectionSearchBox
              collection="spells"
              label="Add a Spell"
              onSelect={(spell) =>
                setCustomSpells(Array.from(new Set([spell, ...customSpells])))
              }
            />

            {/* Display Attached Spells: */}
            <div className="my-3">
              {attachedSpells.map((spell) => (
                <Spell spellData={spell} />
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="my-20">
          <div>Add Tags to this Item:</div>
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

        {/* preview */}

        <h3>Preview</h3>
        <Item itemData={itemDoc} />

        <div className="text-center my-20">
          <button onClick={() => createItem()}>Create Item</button>
        </div>
      </div>
    </div>
  );
}
