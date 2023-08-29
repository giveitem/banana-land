import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getAuroraTable } from '../fetcher.js'

function MaterialTable() {
  // Your table data
  const [rows, setRows] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const first = () => {
    getAuroraTable().then((res) => {
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
            <TableCell>ID</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.first_name}</TableCell>
              <TableCell>{row.last_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default MaterialTable;
