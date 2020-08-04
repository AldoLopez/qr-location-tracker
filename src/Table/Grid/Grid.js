import React, { useState, useEffect } from 'react';
import ReactDataGrid from 'react-data-grid';
import axios from 'axios';

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

getLocation = (location) => {
  // TODO get google map url to lat/long and convert to city name
};

const Grid = () => {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    if (!rows) {
      getRows();
    }
  }),
    [];

  const getRows = async () => {
    // get from db and make fit
  };

  return (
    <ReactDataGrid
      columns={columns}
      rowGetter={(i) => rows[i]}
      rowsCount={10}
    />
  );
};

export default Grid;
