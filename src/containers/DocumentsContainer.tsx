import React, { FC } from 'react';
import {
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { EnumTypeDatatable } from '@/interfaces/enums';
import { Datatable } from '@components/GenericDataTable';
import headers from '@/data/headers.json';
import { useTranslation } from 'react-i18next';
interface DirectionsBookContainerProps {}
const DocumentsContainer: FC<DirectionsBookContainerProps> = () => {
  const [selectedTab, setSelectedTab] = React.useState('demande');
  const { t } = useTranslation();

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setSelectedTab(newAlignment);
  };

  const children = [
    <ToggleButton value="demande" key="left" sx={{ borderRadius: '8px' }}>
      {t('by_request')}
    </ToggleButton>,
    <ToggleButton
      value="nomenclature"
      key="center"
      sx={{ borderRadius: '8px' }}
    >
      {t('par_nomenclature')}
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
        {t('documents')}
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

      {selectedTab === 'demande' ? (
        <Datatable
          type={EnumTypeDatatable.DOCUMENTS}
          headers={headers.documents}
        />
      ) : (
        <Datatable
          type={EnumTypeDatatable.DOCUMENTS_BY_NOMENCLATURE}
          headers={headers.nomenclature_docs}
        />
      )}
    </Box>
  );
};

export default DocumentsContainer;
