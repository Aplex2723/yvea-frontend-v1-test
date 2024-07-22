import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Divider,
  ToggleButton,
  Stack,
  ToggleButtonGroup
} from '@mui/material';
import { formatDate } from '../../../utils/common';
import { TextDetail } from './TextDetail';
import { Datatable } from '@/components/GenericDataTable';
import { EnumTypeDatatable } from '@/interfaces/enums';
import headers from '@/data/headers.json';
import { useTranslation } from 'react-i18next';

const CerticateInformation = ({ certficateData }: any) => {
  const [selectedTab, setSelectedTab] = useState<string>('seller');
  const [dataToDisplay, setDataToDisplay] = useState<any>();
  const { t } = useTranslation();

  const children = [
    <ToggleButton
      value="seller"
      key="center"
      sx={{ borderRadius: '8px', textTransform: 'none' }}
    >
      {t('sellers')}
    </ToggleButton>,
    <ToggleButton
      value="buyer"
      key="left"
      sx={{ borderRadius: '8px', textTransform: 'none' }}
    >
      {t('buyers')}
    </ToggleButton>,

    <ToggleButton
      value="inspection_place"
      key="center"
      sx={{ borderRadius: '8px', textTransform: 'none' }}
    >
      {t('inspection_locations')}
    </ToggleButton>,

    <ToggleButton
      value="shipping_method"
      key="center"
      sx={{ borderRadius: '8px', textTransform: 'none' }}
    >
      {t('shipping_method')}
    </ToggleButton>
  ];

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    console.log('newAlignment', newAlignment);
    console.log('certficateData', certficateData);
    switch (newAlignment) {
      case 'seller':
        setDataToDisplay(certficateData?.seller);
        break;
      case 'buyer':
        setDataToDisplay(certficateData?.buyer); // Setting buyer data
        break;
      case 'inspection_place':
        setDataToDisplay(certficateData?.inspection_place); // Setting inspection_place data
        break;
      case 'shipping_method':
        setDataToDisplay({
          method: certficateData?.expedition_method,
          incoterm: certficateData?.expedition_incoterm
        }); // Setting shipping_method data
        break;
      default:
        setDataToDisplay(null);
        break;
    }

    setSelectedTab(newAlignment);
  };

  const control = {
    value: selectedTab,
    onChange: handleChange,
    exclusive: true
  };

  useEffect(() => {
    if (certficateData) return handleChange(null, 'seller');
  }, [certficateData]);

  return (
    <Box marginTop={'1.5rem'} width={'100%'}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextDetail
            label={t('request_date')}
            value={formatDate(certficateData?.created_at)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextDetail
            label={t('certficate_cost')}
            value={certficateData?.total_cost}
          />
        </Grid>
        <Grid item xs={6}>
          <TextDetail label={'Pays'} value={certficateData?.country} />
        </Grid>
        <Grid item xs={6}>
          <TextDetail
            label={t('date_inspection')}
            value={formatDate(certficateData?.inspection_date)}
          />
        </Grid>
      </Grid>

      <Typography
        marginTop={'3rem'}
        variant="h6"
        color={'grey.800'}
        fontWeight={'500'}
      >
        {t('expeditions')}
      </Typography>
      <Divider sx={{ width: '100%', margin: '1rem auto 1rem' }} />

      <Stack spacing={2} alignItems="start" sx={{ mt: '2rem' }}>
        <ToggleButtonGroup
          {...control}
          color={'primary'}
          aria-label="Medium sizes"
        >
          {children}
        </ToggleButtonGroup>
      </Stack>

      {selectedTab !== 'shipping_method' && (
        <Grid container spacing={2} marginTop={'1.5rem'}>
          <Grid item xs={6}>
            <TextDetail label={t('comp_name')} value={dataToDisplay?.name} />
          </Grid>
          <Grid item xs={6}>
            <TextDetail label={t('country')} value={dataToDisplay?.country} />
          </Grid>
          <Grid item xs={6}>
            <TextDetail label={t('email')} value={dataToDisplay?.email} />
          </Grid>
          <Grid item xs={6}>
            <TextDetail label={t('phone')} value={dataToDisplay?.phone} />
          </Grid>
          <Grid item xs={6}>
            <TextDetail
              label={t('full_address')}
              value={dataToDisplay?.address}
            />
          </Grid>
          <Grid item xs={3}>
            <TextDetail
              label={t('postal_code')}
              value={dataToDisplay?.postal_code}
            />
          </Grid>
          <Grid item xs={3}>
            <TextDetail label={t('city')} value={dataToDisplay?.city} />
          </Grid>

          {selectedTab === 'inspection_place' && (
            <Grid item xs={6}>
              <TextDetail
                label={t('last_name')}
                value={dataToDisplay?.contact_lastname}
              />
            </Grid>
          )}
          {selectedTab === 'inspection_place' && (
            <Grid item xs={6}>
              <TextDetail
                label={t('first_name')}
                value={dataToDisplay?.contact_name}
              />
            </Grid>
          )}
        </Grid>
      )}

      {selectedTab === 'shipping_method' && (
        <Grid container spacing={2} marginTop={'1.5rem'}>
          <Grid item xs={6}>
            <TextDetail label={t('method')} value={dataToDisplay?.method} />
          </Grid>
          <Grid item xs={6}>
            <TextDetail label={t('incoterm')} value={dataToDisplay?.incoterm} />
          </Grid>
        </Grid>
      )}

      <Typography
        marginTop={'3rem'}
        variant="h6"
        color={'grey.800'}
        fontWeight={'500'}
      >
        {t('product_nomenclatures')}
      </Typography>

      <Typography variant="body2" color={'grey.500'}>
        {t('total_value')} –{' '}
        <span style={{ fontWeight: '700' }}>
          {certficateData?.total_cost ? certficateData?.total_cost : 0} € –
          {certficateData?.nomenclature_codes?.length} {t('codes')}{' '}
        </span>
      </Typography>
      <Divider sx={{ width: '100%', margin: '1rem auto 1rem' }} />

      <Datatable
        type={EnumTypeDatatable.NOMENCLAUTRE_CODE}
        headers={headers.nomenclature_codes}
        localData={certficateData?.nomenclature_codes}
        withoutPagination
      />
    </Box>
  );
};

export default CerticateInformation;
