// returns the entire collection as an array, or all of a collection with a gameTerminalId

import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const { collection, gameTerminalId } = req.query;
  const client = await clientPromise;

  const matches = await client
    .db()
    .collection(collection)
    .find(gameTerminalId ? { gameTerminalId } : {})
    .toArray();

  res.json(matches);
}
