import React from 'react';
import Grid from './Grid/Grid';
import './Table.css';

class Table extends React.Component {
  render() {
    return (
      <div className='middleTable'>
        <Grid />
      </div>
    );
  }
}

export default Table;
