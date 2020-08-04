const { GEO_KEY } = process.env;
import axios from 'axios';

exports.handler = async (event, context) => {
  const { identity, user } = context.clientContext;
  //   if (!user) {
  //     return { statusCode: 403, body: 'You shall not pass!' };
  //   }

  const lat = event.queryStringParameters.latitude;
  const long = event.queryStringParameters.longitude;
  const geoUrl = `https://api.opencagedata.com/geocode/v1/json?key=${GEO_KEY}&q=${lat}%2C${long}`;
  return axios
    .get(geoUrl)
    .then((res) => {
      console.log(res);
      return {
        statusCode: 200,
        body: JSON.stringify(res),
      };
    })
    .catch((err) => {
      console.log(err);
      return {
        statusCode: 422,
        body: JSON.stringify(err),
      };
    });
};
