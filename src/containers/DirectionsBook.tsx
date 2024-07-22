import React, { FC } from 'react';
import {
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { Datatable } from '@components/GenericDataTable';
import { EnumTypeDatatable } from '@/interfaces/enums';
import headers from '@/data/headers.json';
import { useTranslation } from 'react-i18next';

interface DirectionsBookContainerProps {}
const DirectionsBookContainer: FC<DirectionsBookContainerProps> = () => {
  const [selectedTab, setSelectedTab] = React.useState('buyers');
  const { t } = useTranslation();

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setSelectedTab(newAlignment);
  };

  const children = [
    <ToggleButton value="buyers" key="left" sx={{ borderRadius: '8px' }}>
      {t('buyers')}
    </ToggleButton>,
    <ToggleButton value="sellers" key="center" sx={{ borderRadius: '8px' }}>
      {t('sellers')}
    </ToggleButton>,
    <ToggleButton value="places" key="center" sx={{ borderRadius: '8px' }}>
      {t('inspection_locations')}
    </ToggleButton>
  ];

  const control = {
    value: selectedTab,
    onChange: handleChange,
    exclusive: true
  };

  return (
    /*container box*/
    <Box sx={{ width: '90%', margin: '0rem auto' }}>
      <Typography variant={'h4'} fontWeight={'bold'}>
        {t('address_book')}
      </Typography>
      <Stack spacing={2} alignItems="start" sx={{ mt: '2rem' }}>
        <ToggleButtonGroup
          {...control}
          color={'primary'}
          aria-label="Medium sizes"
        >
          {children}
        </ToggleButtonGroup>
      </Stack>
      {selectedTab === 'buyers' && (
        <Datatable type={EnumTypeDatatable.BUYERS} headers={headers.buyer} />
      )}
      {selectedTab === 'sellers' && (
        <Datatable type={EnumTypeDatatable.SELLERS} headers={headers.buyer} />
      )}
      {selectedTab === 'places' && (
        <Datatable type={EnumTypeDatatable.PLACES} headers={headers.buyer} />
      )}
    </Box>
  );
};

export default DirectionsBookContainer;
