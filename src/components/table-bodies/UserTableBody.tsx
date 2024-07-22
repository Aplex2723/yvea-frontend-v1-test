import { Header } from '@components/GenericDataTable';
import {
  TableBody,
  TableRow,
  Typography,
  TableCell,
  IconButton
} from '@mui/material';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import React, { FC } from 'react';
import { ROUTES } from '@/constans/routes';
import { useRouter } from 'next/router';

type Props = {
  data: any[];
  headers: Header[];
};

export const UserTableBody: FC<Props> = ({ data = [] }) => {
  const router = useRouter();

  const goToUserDetail = (userId: string) => {
    router.push(`${ROUTES.ADMIN_DASHBOARD_USERS}/${userId}`);
  };
  return (
    <TableBody>
      {data?.map((field, index) => (
        <TableRow
          key={index}
          sx={{ 'td, th': { border: 0, cursor: 'pointer' } }}
          onClick={() => goToUserDetail(field.id)}
        >
          <TableCell align="left" sx={{ textWrap: 'nowrap' }} key={index}>
            <Typography variant="body1" paddingLeft={'1rem'}>{field?.first_name ?? '-'}</Typography>
          </TableCell>
          <TableCell align="left" sx={{ textWrap: 'nowrap' }} key={index}>
            <Typography variant="body1" paddingLeft={'1rem'}>{field?.last_name ?? '-'}</Typography>
          </TableCell>
          <TableCell align="left" sx={{ textWrap: 'nowrap' }} key={index}>
            <Typography variant="body1" paddingLeft={'1rem'}>{field?.email ?? '-'}</Typography>
          </TableCell>
          <TableCell align="left" sx={{ textWrap: 'nowrap' }} key={index}>
            <Typography variant="body1" paddingLeft={'1rem'}>{field?.phone ?? '-'}</Typography>
          </TableCell>
          <TableCell align="left" sx={{ textWrap: 'nowrap' }} key={index}>
            <Typography variant="body1" paddingLeft={'1rem'}>
              {field?.company?.street ?? '-'}
            </Typography>
          </TableCell>
          <TableCell align="left" sx={{ textWrap: 'nowrap' }} key={index}>
            <Typography variant="body1" paddingLeft={'1rem'}>
              {field?.company?.postal_code ?? '-'}
            </Typography>
          </TableCell>
          <TableCell align="left" sx={{ textWrap: 'nowrap' }} key={index}>
            <Typography variant="body1" paddingLeft={'1rem'}>
              {field?.company?.city ?? '-'}
            </Typography>
          </TableCell>
          <TableCell align="left" sx={{ textWrap: 'nowrap' }} key={index}>
            <Typography variant="body1" paddingLeft={'1rem'}>
              {field?.company?.name ?? '-'}
            </Typography>
          </TableCell>
          <TableCell align="left" sx={{ textWrap: 'nowrap' }} key={index}>
            <Typography variant="body1" paddingLeft={'1rem'}>
              {field?.company?.type ?? '-'}
            </Typography>
          </TableCell>
          <TableCell align="left" sx={{ textWrap: 'nowrap' }} key={index}>
            <Typography variant="body1" paddingLeft={'1rem'}>
              {field?.company?.fiscal_number ?? '-'}
            </Typography>
          </TableCell>
          <TableCell align="left" sx={{ textWrap: 'nowrap' }} key={index}>
            <IconButton onClick={() => goToUserDetail(field.id)}>
              <RemoveRedEyeOutlinedIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
