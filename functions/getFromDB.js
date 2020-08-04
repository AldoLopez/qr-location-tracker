const { FAUNA_KEY } = process.env;
const faunadb = require('faunadb'),
  q = faunadb.query;

const client = new faunadb.Client({
  secret: FAUNA_KEY,
});

exports.handler = async (event, context) => {
  const { identity, user } = context.clientContext;
  console.log(`identity: ${identity}`);
  console.log(`User: ${user}`);
  if (!user) {
    return { statusCode: 403, body: 'You shall not pass!' };
  }

  return client
    .query(q.Get(q.Ref(q.Collection('devices'))))
    .then((ret) => console.log(ret))
    .catch((err) => console.log(err));
};
