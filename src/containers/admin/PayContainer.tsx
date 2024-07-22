import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { Datatable } from '@components/GenericDataTable';
import { EnumTypeDatatable } from '@/interfaces/enums';
import headers from '@/data/headers.json';
import { useTranslation } from 'react-i18next';

const PaysContainer: FC = () => {
  const { t } = useTranslation();

  return (
    /*container box*/
    <Box sx={{ width: '90%', margin: '0rem auto' }}>
      <Typography variant={'h4'} fontWeight={'bold'}>
        {t('country')}
      </Typography>
      <Datatable type={EnumTypeDatatable.PAYS} headers={headers.countries} />
    </Box>
  );
};

export default PaysContainer;
