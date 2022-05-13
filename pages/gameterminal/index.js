import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { logToLocalHistory } from "../../lib/hooks/react-localhistory";
import useSocket from "../../lib/hooks/socketio";
import ItemCreator from "../../components/ItemCreator";
import { useState } from "react/cjs/react.production.min";

export default function GameTerminal({ gameData }) {
  useEffect(logToLocalHistory, []);
  const socketio = useSocket("gameterminals");

  const VIEW_STATES = {
    CHARACTER_CREATOR: CharacterCreator,
    ITEM_CREATOR: ItemCreator,
    SPELL_CREATOR: SpellCreator,
    CHARACTER: Character,
  };
  const [currentView, setCurrentView] = useState();

  return (
    <div>
      {/* Game Link Copier and Display */}
      <div className="text-sm mx-1 mb-10">
        _id:
        <span
          className="text-blue-600 cursor-pointer mx-2"
          onClick={() => {
            copy(document.location); // copy to clipboard if pressed
            toast("Game Link Copied to Clipboard!", {
              autoClose: 900,
              hideProgressBar: true,
            });
          }}
        >
          {gameData._id}
        </span>
      </div>
      <h1></h1>
      <div className="p-3"></div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;

  let gameData = null;

  try {
    const client = await clientPromise;

    if (query._id) {
      gameData = await client
        .db()
        .collection("gameterminals")
        .findOne({ _id: ObjectId(query._id) });
    }

    // if no id was given or the gameData does not exist,
    // then create the character and rerun this function with
    // the query _id value set:
    if (!gameData) {
      const mongoInsertResponse = await client
        .db()
        .collection("gameterminals")
        .insertOne({});

      return {
        redirect: {
          destination: `/gameterminal?_id=${mongoInsertResponse.insertedId.toString()}`,
        },
      };
    }
  } catch (err) {
    return { redirect: { destination: "/dberror" } };
  }

  // return the gameData, with the _id property converted
  // to a serializable string:
  gameData._id = gameData._id.toString();
  return { props: { gameData } };
}
