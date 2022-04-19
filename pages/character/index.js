import { ObjectId } from "mongodb";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

import CharacterName from "../../components/CharacterName";
import CharacterInventory from "../../components/CharacterInventory";
import CharacterSpells from "../../components/CharacterSpells";
import clientPromise from "../../lib/mongodb";
import { logToLocalHistory } from "../../lib/hooks/react-localhistory";
import { useSocketIO } from "../../lib/hooks/socketio";

export default function Character({ characterData }) {
  useEffect(logToLocalHistory, []);
  const socketio = useSocketIO("gameterminals");
  //FIXME: this should reprogrammed to be like... singleton somehow. idk

  const [name, setName] = useState(characterData.name || "Nameless");
  const [inventory, setInventory] = useState(characterData.inventory || []);
  const [spells, setSpells] = useState(characterData.spells || []);

  function updateName(updatedName) {
    setName(updatedName); // update client display
    socketio.emit();
  }

  function updateInventory(updatedInventory) {
    setInventory(updateInventory); // update client display
  }

  function updateSpells(updatedSpells) {
    setSpells(updateSpells); // update client display
  }

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
