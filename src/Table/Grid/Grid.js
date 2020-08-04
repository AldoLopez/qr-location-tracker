import React, { useState, useEffect } from 'react';
import DataGrid from 'react-data-grid';
import 'react-data-grid/dist/react-data-grid.css';
import axios from 'axios';
import { DateTime } from 'luxon';
import { generateHeaders } from '../../identityActions';

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
        .get('/.netlify/functions/getFromDB', {
          headers,
        })
        .then((response) => {
          console.log(response);
          const data = response.data.data;
          const dataRows = data.map(async (row) => {
            const res = await getLocation(JSON.parse(row.data.location));
            return {
              deviceId: row.data.deviceId,
              date: DateTime.fromJSDate(new Date(row.data.date)).toLocaleString(
                DateTime.DATETIME_MED
              ),
              location: `${res.city}, ${res.state}`,
            };
          });
          setRows(dataRows);
        })
        .then(() => {
          setLoading(false);
        })
        .catch((err) => console.log(err));
    });
  };

  const getLocation = (location) => {
    return axios
      .get('/.netlify/functions/convertLocationData', {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data) {
          const city = response.data.city;
          const state = response.data.state_code;
          const link = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;

          return {
            city,
            state,
            link,
          };
        }
      });
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
