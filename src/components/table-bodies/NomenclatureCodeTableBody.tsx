import { TableBody, TableRow, Typography, TableCell } from '@mui/material';
import React, { FC } from 'react';

type Props = {
  data: any[];
};

export const NomenclatureCodeTableBody: FC<Props> = ({ data = [] }) => {
  return (
    <TableBody>
      {data?.map((field) => (
        <TableRow
          key={field?.id}
          sx={{ 'td, th': { border: 0, cursor: 'pointer' } }}
        >
          <TableCell align="left">
            <Typography color={'grey.800'} fontWeight={'500'} variant="body2">
              {field?.code ?? '-'}
            </Typography>
          </TableCell>
          <TableCell align="left">
            <Typography variant="body2" color={'grey.500'}>
              {(field.amount && `${field?.amount} €`) ?? '-'}
            </Typography>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
