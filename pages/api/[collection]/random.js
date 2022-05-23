import clientPromise from "../../../lib/mongodb";

// takes collection, tags (as a stringified array), and a limit
export default async function handler(req, res) {
  const { collection } = req.query;
  const tags =
    req.query.tags && JSON.parse(req.query.tags).length > 0
      ? JSON.parse(req.query.tags)
      : undefined;

  const limit = req.query.limit || 10; // limit defaults to 10

  const client = await clientPromise;

  // get all documents with the given tags
  const matches = await client
    .db()
    .collection(collection)
    .find(tags ? { tags } : {})
    .toArray();

  // randomly pick 'limit' number of documents from list
  // first, shuffle the matches list:
  const shuffledMatches = matches.sort(() => Math.random() - 0.5);

  const limitedMatches = shuffledMatches.slice(0, limit);

  res.json([...limitedMatches]);
}
