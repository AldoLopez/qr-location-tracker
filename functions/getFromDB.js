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

  return client
    .query(
      q.Map(
        q.Paginate(Documents(Collection('devices'))),
        q.Lambda((x) => q.Get(x))
      )
    )
    .then((ret) => console.log(ret))
    .catch((err) => console.log(err));
};

devices;
