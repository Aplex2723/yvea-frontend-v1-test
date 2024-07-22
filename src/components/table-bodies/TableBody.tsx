import { Header } from '@components/GenericDataTable';
import {
  TableBody,
  TableRow,
  Typography,
  TableCell,
  IconButton
} from '@mui/material';
import React, { FC } from 'react';
import { CreateOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

type Props = {
  data: any[];
  headers: Header[];
  align?: 'left' | 'center' | 'right';
  editAction?: (uuid: string) => void;
  onClickEdit?: (uuid: string) => void;
};

export const FlatTableBody: FC<Props> = ({
  data = [],
  headers = [],
  onClickEdit,
  align = 'center'
}) => {
  const { t } = useTranslation();
  return (
    <TableBody>
      {data?.map((field, index) => (
        <TableRow key={index} sx={{ 'td, th': { border: 0 } }}>
          {headers.map((header, index) =>
            header.orderField === 'address' ? (
              <TableCell
                align="left"
                sx={{ textWrap: 'nowrap', width: 'maxContent', paddingLeft: '2rem' }}
                key={index}
              >
                <Typography variant="body1">
                  {field?.[header.orderField] ?? '-'}
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.500' }}>
                  {field?.postal_code ?? '-'}, {t(field?.country) ?? '-'}
                </Typography>
              </TableCell>
            ) : header.orderField === 'actions' ? (
              <TableCell
                align="right"
                sx={{ textWrap: 'nowrap', width: 'maxContent' }}
                key={index}
              >
                <IconButton onClick={() => onClickEdit(field.id)}>
                  <CreateOutlined />
                </IconButton>
              </TableCell>
            ) : (
              <TableCell
                align={align}
                sx={{
                  textWrap: 'nowrap',
                  paddingX: '2rem',
                  width: 'maxContent'
                }}
                key={index}
              >
                <Typography variant="body1">
                  {field?.[header.orderField] ?? '-'}
                </Typography>
              </TableCell>
            )
          )}
        </TableRow>
      ))}
    </TableBody>
  );
};
