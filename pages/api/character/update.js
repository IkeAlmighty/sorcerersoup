import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const character = JSON.parse(req.body);
  const _id = ObjectId(character._id);
  delete character._id;

  const client = await clientPromise;

  const mongoUpdateResponse = await client
    .db()
    .collection("characters")
    .updateOne({ _id }, { $set: { ...character } });

  //TODO: add proper error reporting

  res.status(200).end();
}
