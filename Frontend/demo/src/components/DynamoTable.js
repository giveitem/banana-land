import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useState } from 'react';
import { getDynamoDBTable } from '../fetcher.js';

function MaterialTable() {
  // Your table data
  const [rows, setRows] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const first = () => {
    getDynamoDBTable().then((res) => {
      setRows(res);
    })
    console.log(rows);

  }
  if (!loaded) {
    first();
    setLoaded(true);
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
        <TableRow>
            <TableCell padding={'none'} align={'center'} style={{ fontSize: '10px' }}>ID</TableCell>
            <TableCell padding={'none'} align={'center'} style={{ fontSize: '10px' }}>First Name</TableCell>
            <TableCell padding={'none'} align={'center'} style={{ fontSize: '10px' }}>Last Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell padding={'none'} align={'center'} style={{ fontSize: '10px' }}>{row.id}</TableCell>
              <TableCell padding={'none'} align={'center'} style={{ fontSize: '10px' }}>{row.first_name}</TableCell>
              <TableCell padding={'none'} align={'center'} style={{ fontSize: '10px' }}>{row.last_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default MaterialTable;
