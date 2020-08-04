import React, { useState, useEffect } from 'react';
import DataGrid from 'react-data-grid';
import 'react-data-grid/dist/react-data-grid.css';
import axios from 'axios';
import { DateTime } from 'luxon';
import { generateHeaders } from '../../identityActions';

const getLocation = async (location) => {
  return await generateHeaders().then((headers) => {
    axios
      .get(
        'https://qr-location.netlify.app/.netlify/functions/convertLocationData',
        {
          headers,
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        }
      )
      .then((response) => {
        console.log(response);
        const city = response.data.city;
        const state = response.data.state_code;
        const link = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;

        return {
          city,
          state,
          link,
        };
      })
      .catch((err) => console.log(err));
  });
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
          data.forEach(async (row) => {
            const locationObject = await getLocation(
              JSON.parse(row.data.location)
            );
            dataRows.push({
              deviceId: row.data.deviceId,
              date: DateTime.fromJSDate(new Date(row.data.date)).toLocaleString(
                DateTime.DATETIME_MED
              ),
              location: `${locationObject.city}, ${locationObject.state}`,
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
