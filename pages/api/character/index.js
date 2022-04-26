import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const { _id } = req.query;

  const client = await clientPromise;

  let character = await client
    .db()
    .collection("characters")
    .findOne({ _id: ObjectId(_id) });

  if (!character) {
    res.status(404).end();
    return;
  }

  character._id = character._id.toString();
  res.json(character);
}
