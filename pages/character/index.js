import { ObjectId } from "mongodb";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { useEffect, useState, useRef } from "react";

import CharacterName from "../../components/CharacterName";
import CharacterInventory from "../../components/CharacterInventory";
import CharacterSpells from "../../components/CharacterSpells";
import clientPromise from "../../lib/mongodb";
import { logToLocalHistory } from "../../lib/hooks/react-localhistory";
import useSocket from "../../lib/hooks/socketio";

export default function Character({ characterData }) {
  useEffect(logToLocalHistory, []);
  const socketio = useSocket("gameterminals");

  const [name, setName] = useState(characterData.name || "Nameless");
  const [inventory, setInventory] = useState(characterData.inventory || []);
  const [spells, setSpells] = useState(characterData.spells || []);

  const [gameTerminalId, setGameTerminalId] = useState(
    characterData.gameTerminalId || undefined
  );

  const saveTimeStamp = useRef(undefined);

  function emitCharacterUpdate() {
    // if (!gameTerminalId) {
    //   alert("please enter a game id!");
    //   return;
    // }

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

  async function saveCharacterToDatabase() {
    let apiResponse = await fetch(`/api/character/update`, {
      method: "POST",
      body: JSON.stringify({ _id: characterData._id, name, inventory, spells }),
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
  }, [name, spells, inventory]);

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
          <h2>Inventory</h2>
          <CharacterInventory value={inventory} onChange={updateInventory} />

          <h2>Spells</h2>
          <CharacterSpells value={spells} onChange={updateSpells} />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;

  let characterData = null;
  const client = await clientPromise;

  if (query._id) {
    characterData = await client
      .db()
      .collection("characters")
      .findOne({ _id: ObjectId(query._id) });
  }

  // if no id was given or the characterData does not exist,
  // then create the character and rerun this function with
  // the query _id value set:
  if (!characterData) {
    const mongoInsertResponse = await client
      .db()
      .collection("characters")
      .insertOne({});

    return {
      redirect: {
        destination: `/character?_id=${mongoInsertResponse.insertedId.toString()}`,
      },
    };
  }

  // return the characterData, with the _id property converted
  // to a serializable string:
  characterData._id = characterData._id.toString();
  return { props: { characterData } };
}
