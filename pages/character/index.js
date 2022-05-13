import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";
import { useEffect } from "react";
import { logToLocalHistory } from "../../lib/hooks/react-localhistory";
import Character from "../../components/Character";

export default function CharacterPage({ characterData }) {
  useEffect(logToLocalHistory, []);

  return (
    <div>
      <Character characterData={characterData} />
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
