import React, { useState, useEffect } from 'react';
import DataGrid from 'react-data-grid';
import 'react-data-grid/dist/react-data-grid.css';
import axios from 'axios';
import netlifyIdentity from 'netlify-identity-widget';

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

  const defaultColumnProperties = {
    sortable: true,
  };

  const columns = [
    {
      key: 'deviceId',
      name: 'Device Id',
    },
    {
      key: 'date',
      name: 'Date',
      sortDescendingFirst: true,
    },
    {
      key: 'location',
      name: 'Location',
    },
  ].map((c) => ({ ...c, ...defaultColumnProperties }));

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
          const data = response.data.data;
          const dataRows = [];
          data.forEach((row) => {
            dataRows.push({
              deviceId: row.data.deviceId,
              date: `${new Date(row.data.date).toDateString()} at${new Date(
                row.data.date
              ).toTimeString()}`,
              location: row.data.location,
            });
          });
          setRows(dataRows);
        })
        .then(() => {
          setLoading(false);
        })
        .catch((err) => console.log(err));
    });
    // const fakeRows = [
    //   {
    //     deviceId: 'dsfsdgfsd',
    //     date: new Date('11/12/2019').toISOString(),
    //     location: 'newark',
    //   },
    //   {
    //     deviceId: '23232',
    //     date: new Date('1/2/2020').toISOString(),
    //     location: 'plainfield',
    //   },
    //   {
    //     deviceId: '3rngvee',
    //     date: new Date('11/12/2018').toISOString(),
    //     location: 'dunnellen',
    //   },
    // ];
    // setRows(fakeRows);
    // setLoading(false);
  };

  const [direction, setDirection] = useState(true);

  const sortRows = (initialRows, sortColumn, sortDirection) => (rows) => {
    const comparer = (a, b) => {
      if (direction) {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    };
    setDirection(!direction);
    return sortDirection === 'NONE' ? initialRows : [...rows].sort(comparer);
  };

  if (loading) {
    return <div> Loading </div>;
  } else {
    return (
      <div>
        <DataGrid
          columns={columns}
          rows={rows}
          onSort={(sortColumn, sortDirection) =>
            setRows(sortRows(rows, sortColumn, sortDirection))
          }
        />
      </div>
    );
  }
};

export default Grid;
