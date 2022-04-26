import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { logToLocalHistory } from "../../lib/hooks/react-localhistory";
import useSocket from "../../lib/hooks/socketio";

export default function GameTerminal({ gameData }) {
  useEffect(logToLocalHistory, []);
  const socketio = useSocket("gameterminals");

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
    </div>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;

  let gameData = null;
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

  // return the gameData, with the _id property converted
  // to a serializable string:
  gameData._id = gameData._id.toString();
  return { props: { gameData } };
}
