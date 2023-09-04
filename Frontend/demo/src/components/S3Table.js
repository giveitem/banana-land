import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';

function S3Table() {
  const [objectList, setObjectList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/aws-objects')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setObjectList(data);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, []);

  const displayedObjects = objectList.slice(-4, -1);

  return (
    <div>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding={'none'} align={'left'} style={{ fontSize: '10px' }}>Key</TableCell>
              <TableCell padding={'none'} align={'left'} style={{ fontSize: '10px' }}>Last Modified</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedObjects.map((object, index) => (
              <TableRow key={index}>
                <TableCell padding={'none'} align={'left'} style={{ fontSize: '10px' }}>{object.Key}</TableCell>
                <TableCell padding={'none'} align={'left'} style={{ fontSize: '10px' }}>{object.LastModified}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default S3Table;