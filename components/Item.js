import { useState } from "react";
import Spell from "./Spell";

export default function Item({ itemData, onRemove }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="border-l border-black pl-3">
      <h2>
        {itemData?.name}
        <span
          className="text-xs mx-6 mt-3 cursor-pointer font-extrabold text-blue-400 float-right"
          type="button"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "hide" : "show"} details
        </span>
      </h2>

      <div className="text-sm italic my-3">{itemData?.description}</div>

      {showDetails && (
        <div>
          {itemData?.combatModifier && (
            <div className="text-sm">
              Damage:{" "}
              <span className="font-bold text-red-400">
                {itemData?.combatModifier}
              </span>
            </div>
          )}

          {itemData?.healingModifier && (
            <div className="text-sm">
              Healing:{" "}
              <span className="font-bold text-green-800">
                {itemData?.healingModifier}
              </span>
            </div>
          )}

          {itemData?.hpModifier && (
            <div className="text-sm">
              HP Modifier:{" "}
              <span className="font-bold text-blue-400">
                {itemData?.hpModifier}
              </span>
            </div>
          )}

          {itemData.attachedSpells.length > 0 && (
            <div className="mt-6 text-lg font-bold">Spells</div>
          )}
          {itemData?.attachedSpells?.map((spell) => {
            return (
              <div key={spell._id} className="mb-6">
                <Spell spellData={spell} />
              </div>
            );
          })}

          {onRemove && (
            <div className="my-6">
              <span
                className="text-sm cursor-pointer text-red-300 hover:text-red-600 italic"
                onClick={() => onRemove(itemData)}
              >
                Remove Item
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
