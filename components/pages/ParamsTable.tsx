import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
} from '@mui/material';
import { useTheme } from '@mui/system';
import React, { FC } from 'react';

const ParamsTable: FC = () => {
  const theme = useTheme<Required<Theme>>();

  const rows: {
    parameter: string;
    required: 'Yes' | 'No';
    dataType: string;
    acceptedValues: string;
    description: string;
  }[] = [
    {
      parameter: '$skip',
      required: 'No',
      dataType: 'number',
      acceptedValues: 'positive whole numbers',
      description: 'skip skip skip',
    },
    {
      parameter: '$top',
      required: 'No',
      dataType: 'number',
      acceptedValues: '0-10',
      description: 'top  top top',
    },
    {
      parameter: '$orderby',
      required: 'No',
      dataType: 'string[]',
      acceptedValues: 'props of the object',
      description: 'order order order',
    },
    {
      parameter: '$select',
      required: 'No',
      dataType: 'string[]',
      acceptedValues: 'props of the object',
      description: 'only the specified props will be returned',
    },
    {
      parameter: '$filter',
      required: 'No',
      dataType: 'string',
      acceptedValues: 'see more',
      description: 'filter, filter, filter, filter, filter',
    },
  ];

  return (
    <Table sx={{ minWidth: 650 }} size='small' aria-label='simple table'>
      <TableHead>
        <TableRow
          sx={{
            '> th': {
              color: theme.palette.primary.dark,
              fontWeight: 700,
            },
          }}
        >
          <TableCell>Parameter</TableCell>
          <TableCell>Required?</TableCell>
          <TableCell>Data&nbsp;Type</TableCell>
          <TableCell>Accepted&nbsp;Values</TableCell>
          <TableCell>Description</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.parameter}
            sx={{
              '&:nth-child(odd)': {
                backgroundColor: theme.palette.background.default,
              },
              whiteSpace: 'nowrap',
              '&:last-child td': { border: 0, whiteSpace: 'normal' },
            }}
          >
            <TableCell>{row.parameter}</TableCell>
            <TableCell>{row.required}</TableCell>
            <TableCell>{row.dataType}</TableCell>
            <TableCell>{row.acceptedValues}</TableCell>
            <TableCell style={{ width: '100%' }}>{row.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ParamsTable;
