import clientPromise from "../../../lib/mongodb";

export default async function createDocument(req, res) {
  const { collection } = req.query;
  const document = JSON.parse(req.body);

  const client = await clientPromise;
  const mongoInsertResponse = await client
    .db()
    .collection(collection)
    .insertOne(document);

  console.log(mongoInsertResponse);

  res.status(200).end();
}
