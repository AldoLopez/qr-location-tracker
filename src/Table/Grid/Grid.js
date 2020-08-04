import React, { useState, useCallback, useEffect, useMemo } from 'react';
import DataGrid from 'react-data-grid';
import 'react-data-grid/dist/react-data-grid.css';
import axios from 'axios';
import { DateTime } from 'luxon';
import { generateHeaders } from '../../identityActions';

const Grid = () => {
  const [gridRows, setGridRows] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultColumnProperties = {
    sortable: true,
  };

  const columns = [
    {
      key: 'deviceId',
      name: 'Device Id',
      sortable: true,
    },
    {
      key: 'date',
      name: 'Date',
      sortable: true,
    },
    {
      key: 'location',
      name: 'Location',
      sortable: true,
    },
  ].map((c) => ({ ...c, ...defaultColumnProperties }));

  useEffect(() => {
    if (!gridRows) {
      getRows();
    }
  });

  const getRows = () => {
    generateHeaders().then((headers) => {
      axios
        .get('/.netlify/functions/getFromDB', {
          headers,
        })
        .then(async (response) => {
          console.log(response);
          const data = response.data.data;
          const dataRows = [];
          data.forEach(async (row) => {
            const res = await getLocation(JSON.parse(row.data.location));
            dataRows.push({
              deviceId: row.data.deviceId,
              date: DateTime.fromJSDate(new Date(row.data.date)).toLocaleString(
                DateTime.DATETIME_MED
              ),
              location: `${res.city}, ${res.state}`,
            });
          });
          setGridRows(dataRows);
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

  const [[sortColumn, sortDirection], setSort] = useState(['deviceId', 'NONE']);

  const sortedRows = useMemo(() => {
    if (sortDirection === 'NONE') return gridRows;

    let sortedRows = [...gridRows];
    sortedRows = sortedRows.sort((a, b) =>
      a[sortColumn].localeCompare(b[sortColumn])
    );

    return sortDirection === 'DESC' ? sortedRows.reverse() : sortedRows;
  }, [gridRows, sortDirection, sortColumn]);

  const handleRowsUpdate = useCallback(
    ({ fromRow, toRow, updated }) => {
      const newRows = [...sortedRows];

      for (let i = fromRow; i <= toRow; i++) {
        newRows[i] = { ...newRows[i], ...updated };
      }

      setGridRows(newRows);
    },
    [sortedRows]
  );

  const handleSort = useCallback((columnKey, direction) => {
    setSort([columnKey, direction]);
  }, []);

  if (loading) {
    return <div> Loading </div>;
  } else {
    return (
      <div>
        <DataGrid
          columns={columns}
          rows={sortedRows}
          onRowsUpdate={handleRowsUpdate}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>
    );
  }
};

export default Grid;
