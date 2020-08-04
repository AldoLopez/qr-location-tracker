const { FAUNA_KEY } = process.env;
const faunadb = require('faunadb'),
  q = faunadb.query;

const client = new faunadb.Client({
  secret: FAUNA_KEY,
});

exports.handler = async (event, context) => {
  const { identity, user } = context.clientContext;
  console.log(`identity: ${JSON.stringify(identity)}`);
  console.log(`User: ${user}`);
  if (!user) {
    return { statusCode: 403, body: 'You shall not pass!' };
  }
  // new loca
  const results = await client
    .query(
      q.Map(
        q.Paginate(q.Match(q.Index('all'))),
        q.Lambda((x) => q.Get(x))
      )
    )
    .then((ret) => {
      return {
        statusCode: 200,
        body: JSON.stringify(ret),
      };
    })
    .catch((err) => ({
      statusCode: 422,
      body: String(err),
    }));
  console.log(`Results: ${JSON.stringify(results)}`);
  return results;
};
