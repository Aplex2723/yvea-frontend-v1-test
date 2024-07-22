import {
  TableBody,
  TableRow,
  Typography,
  TableCell,
  IconButton
} from '@mui/material';
import React, { FC } from 'react';
import { formatDate, statusColors } from '../../../utils/common';
import { EnumCerficatesStatus } from '@/interfaces/enums';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { useTranslation } from 'react-i18next';

type Props = {
  data: any[];
  onClickEdit?: (uuid: string) => void;
  onClickDelete?: (uuid: string) => void;
};

export const CertificatesTableBody: FC<Props> = ({
  data = [],
  onClickEdit,
  onClickDelete
}) => {
  const {t} = useTranslation()
  return (
    <TableBody>
      {data?.map((field) => (
        <TableRow key={field?.id} sx={{ 'td, th': { border: 0 } }}>
          <TableCell align="left" sx={{ textWrap: 'break-word' }} style={{ width: '14rem' }}>
            <Typography paddingX="1rem" variant="body1">
              {field?.title ?? '-'}
            </Typography>
          </TableCell>
          <TableCell align="left" sx={{ textWrap: 'nowrap' }}>
            <Typography paddingX="1rem" variant="body1">
              {field?.created_at ? formatDate(field?.created_at) : '-'}
            </Typography>
          </TableCell>
          <TableCell align="left" sx={{ textWrap: 'nowrap' }}>
            <Typography paddingX="1rem" variant="body1">
              {field?.total_cost ? `${field?.total_cost} €` : '-'}
            </Typography>
          </TableCell>
          <TableCell align="left" sx={{ textWrap: 'nowrap' }}>
            <Typography paddingX="1rem" variant="body1">
              {field?.custom_authority?.name && field?.custom_authority?.contact
                ? `${field?.custom_authority?.name ?? ''} ${
                    field?.custom_authority?.contact
                  }`
                : '-'}
            </Typography>
          </TableCell>
          <TableCell align="left" sx={{ textWrap: 'nowrap' }}>
            <Typography
              paddingX="1rem"
              variant="body1"
              width={'max-content'}
              color={statusColors[field?.status]}
              borderRadius={'1rem'}
            >
              {t(EnumCerficatesStatus[field?.status]) ?? '-'}
            </Typography>
          </TableCell>
          <TableCell align="center" sx={{ textWrap: 'nowrap' }}>
            <IconButton onClick={() => onClickEdit(field)}>
              <RemoveRedEyeOutlinedIcon />
            </IconButton>
            <IconButton onClick={() => onClickDelete(field.id)}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
