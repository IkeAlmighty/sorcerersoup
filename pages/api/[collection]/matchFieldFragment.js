import clientPromise from "../../../lib/mongodb";

export default async function hander(req, res) {
  const { fragment, collection, field, gameTerminalId } = req.query;

  const client = await clientPromise;
  // FIXME: the following silenced code is
  // probably the fastest way to do this,
  // but it is not allowed on m0 Atlas clusters :(
  // const fragmentMatches = await client
  //   .db()
  //   .collection(collection)
  //   .aggregate([
  //     {
  //       $regexMatch: {
  //         input: `$${field}`,
  //         regex: `${fragment}`,
  //         options: "i",
  //       },
  //     },
  //     {
  //       $regexMatch: {
  //         input: "$_id",
  //         regex: `${fragment}`,
  //       },
  //     },
  //   ])
  //   .toArray();

  // FIXME: instead of using silence code above, we will
  // do the regex match on the entire item database
  // after grabbing it from the backend, which is
  // inefficient but necessay while this app is not
  // making any money to sustain a m1 or m2 cluster:

  const allDocuments = await client
    .db()
    .collection(collection)
    .find({})
    .toArray();

  let fragmentMatches = [];
  for (let i = 0; i < allDocuments.length; i++) {
    const doc = allDocuments[i];
    if (doc[field] && doc[field].match(new RegExp(fragment, "i"))) {
      // if the game terminal is not defined, all matching docs are valid
      if (gameTerminalId === undefined) {
        fragmentMatches.push(doc);
      } else {
        // if the game terminal IS defined, then only add docs from that game terminal:
        if (doc.gameTerminalId === gameTerminalId) {
          fragmentMatches.push(doc);
        }
      }
    }
  }

  // TODO: sort by MOST similar to least similar

  res.status(200).json(fragmentMatches);
}
