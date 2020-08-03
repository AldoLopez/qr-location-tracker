const { FAUNA_KEY } = process.env;
const faunadb = require('faunadb'),
  q = faunadb.query;

const client = new faunadb.Client({ secret: FAUNA_KEY });

exports.handler = async (event, context) => {
  const deviceId = event.queryStringParameters.deviceId;
  const location = event.queryStringParameters.location;
  const date = new Date().toString();
  client
    .query(
      q.Create(q.Collection('devices'), { data: { deviceId, location, date } })
    )
    .then((data) => ({
      statusCode: 200,
      body: `Added device: ${deviceId}`,
    }))
    .catch((err) => console.log(err));
};
