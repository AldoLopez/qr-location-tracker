import React from 'react';
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

// TODO get google map url to lat/long and convert to city name
