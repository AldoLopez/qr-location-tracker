const { FAUNA_KEY } = process.env;
const faunadb = require('faunadb'),
  q = faunadb.query;

const client = new faunadb.Client({
  secret: FAUNA_KEY,
});

exports.handler = async (event, context) => {
  return client
    .query(q.Get(q.Ref(q.Collection('devices'))))
    .then((ret) => console.log(ret))
    .catch((err) => console.log(err));
};
