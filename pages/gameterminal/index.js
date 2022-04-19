import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { useEffect } from "react";
import { logToLocalHistory } from "../../lib/react-localhistory";

export default function GameTerminal() {
  useEffect(logToLocalHistory, []);
  return <div></div>;
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
