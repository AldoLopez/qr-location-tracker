const { FAUNA_KEY } = process.env;
const faunadb = require('faunadb'),
  q = faunadb.query;

const client = new faunadb.Client({ secret: FAUNA_KEY });

exports.handler = async (event, context) => {
  const deviceId = event.queryStringParameters.deviceId;
  const location = event.queryStringParameters.location;
  const date = new Date().toString();
  const data = { deviceId, location, date };
  console.log(data);
  client
    .query(q.Create(q.Collection('devices'), { data }))
    .then((ret) => console.log(ret))
    .catch((err) => console.log(err));
};
