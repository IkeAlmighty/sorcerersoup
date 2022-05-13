import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { useEffect, useState, useRef } from "react";

import CharacterName from "./CharacterName";
import CharacterInventory from "./CharacterInventory";
import CharacterSpells from "./CharacterSpells";
import CharacterGameId from "./CharacterGameId";

import useSocket from "../../lib/hooks/socketio";

export default function Character({ characterData }) {
  const socketio = useSocket("gameterminals");

  const [name, setName] = useState(characterData.name || "Nameless");
  const [inventory, setInventory] = useState(characterData.inventory || []);
  const [spells, setSpells] = useState(characterData.spells || []);

  const [gameTerminalId, setGameTerminalId] = useState(
    characterData.gameTerminalId || ""
  );

  const saveTimeStamp = useRef(undefined);

  function emitCharacterUpdate(gameTerminalIdEditEdgeCase = false) {
    if (
      !gameTerminalIdEditEdgeCase &&
      (!gameTerminalId || gameTerminalId.trim() === "")
    ) {
      toast(
        "Please fill join a game by filling out the 'Game ID' field with an ID provided by your Game Master",
        { hideProgressBar: true, autoClose: 4000 }
      );
      return;
    }

    socketio.emit("update-character", {
      characterData: {
        _id: characterData._id,
        name,
        inventory,
        spells,
      },
      gameTerminalId,
    });
  }

  function updateName(updatedName) {
    setName(updatedName); // update client display
    emitCharacterUpdate();
  }

  function updateInventory(updatedInventory) {
    setInventory(updatedInventory); // update client display
    emitCharacterUpdate();
  }

  function updateSpells(updatedSpells) {
    setSpells(updatedSpells); // update client display
    emitCharacterUpdate();
  }

  function updateGameId(updatedGameId) {
    setGameTerminalId(updatedGameId);
    emitCharacterUpdate(true);
  }

  async function saveCharacterToDatabase() {
    let apiResponse = await fetch(`/api/character/update`, {
      method: "POST",
      body: JSON.stringify({
        _id: characterData._id,
        name,
        inventory,
        spells,
        gameTerminalId,
      }),
    });

    if (apiResponse.status !== 200) {
      alert(`API ERROR ${apiResponse.status}`);
    }
  }

  // whenever the character is updated,
  // wait for a second, and if no more
  // updates have been made, save the character
  // to the database.
  useEffect(() => {
    saveTimeStamp.current = Date.now();
    setTimeout(() => {
      if (saveTimeStamp.current && Date.now() - saveTimeStamp.current >= 1000) {
        saveTimeStamp.current = undefined;
        saveCharacterToDatabase();
      }
    }, 1000);
  }, [name, spells, inventory, gameTerminalId]);

  // render!
  return (
    <div>
      {/* Character Link Copier and Display */}
      <div className="text-sm mx-1 mb-10">
        _id:
        <span
          className="text-blue-600 cursor-pointer mx-2"
          onClick={() => {
            copy(document.location); // copy to clipboard if pressed
            toast("Character Link Copied to Clipboard!", {
              autoClose: 900,
              hideProgressBar: true,
            });
          }}
        >
          {characterData._id}
        </span>
      </div>

      {/* Character Data and Editing Fields: */}
      <div className="mx-auto max-w-lg">
        <CharacterName value={name} onChange={updateName} />

        <div className="my-3 px-2">
          <h3>Inventory</h3>
          <CharacterInventory
            inventory={inventory}
            onChange={(newInventory) => updateInventory(newInventory)}
          />

          <h3>Spells</h3>
          <CharacterSpells
            spells={spells}
            onChange={(newSpells) => updateSpells(newSpells)}
          />

          <CharacterGameId value={gameTerminalId} onChange={updateGameId} />
        </div>
      </div>
    </div>
  );
}
