import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { Datatable } from '@components/GenericDataTable';
import { EnumTypeDatatable } from '@/interfaces/enums';
import headers from '@/data/headers.json';
import { useTranslation } from 'react-i18next';

const UsersContainer: FC = () => {
  const { t } = useTranslation();
  return (
    /*container box*/
    <Box sx={{ width: '90%', margin: '0rem auto' }}>
      <Typography variant={'h4'} fontWeight={'bold'}>
        {t('users')}
      </Typography>
      <Datatable type={EnumTypeDatatable.USERS} headers={headers.users} />
    </Box>
  );
};

export default UsersContainer;
