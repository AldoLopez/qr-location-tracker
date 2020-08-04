import React, { useState, useEffect } from 'react';
import ReactDataGrid from 'react-data-grid';
import axios from 'axios';
import netlifyIdentity from 'netlify-identity-widget';

const columns = [
  {
    key: 'deviceId',
    name: 'Device Id',
  },
  {
    key: 'date',
    name: 'Date',
  },
  {
    key: 'location',
    name: 'Location',
  },
];

// const getLocation = (location) => {
//   // TODO get google map url to lat/long and convert to city name
// };

const generateHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (netlifyIdentity.currentUser()) {
    return netlifyIdentity
      .currentUser()
      .jwt()
      .then((token) => {
        return { ...headers, Authorization: `Bearer ${token}` };
      });
  }
  return Promise.resolve(headers);
};

const Grid = () => {
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rows) {
      getRows();
    }
  });

  const getRows = () => {
    generateHeaders().then((headers) => {
      axios
        .get('https://qr-location.netlify.app/.netlify/functions/getFromDB', {
          headers,
        })
        .then((response) => {
          console.log(response);
          // set rows and massage
          setRows(['1']);
        })
        .then(() => {
          setLoading(true);
        })
        .catch((err) => console.log(err));
    });
  };

  if (loading) {
    return <div> Loading </div>;
  } else {
    return (
      <ReactDataGrid
        columns={columns}
        rowGetter={(i) => rows[i]}
        rowsCount={10}
      />
    );
  }
};

export default Grid;
