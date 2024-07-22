import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { TextDetail } from './TextDetail';
import { useTranslation } from 'react-i18next';

const UserInformation = ({ userData }: any) => {
  const { t } = useTranslation();
  return (
    <Box marginTop={'1.5rem'} width={'100%'}>
      <Typography
        marginTop={'3rem'}
        variant="h6"
        color={'grey.800'}
        fontWeight={'500'}
      >
        {t('user_information')}
      </Typography>
      <Grid container spacing={2} marginTop={'1rem'}>
        <Grid item xs={6}>
          <TextDetail label={'name'} value={userData?.first_name} />
        </Grid>
        <Grid item xs={6}>
          <TextDetail label={'last_name'} value={userData?.last_name} />
        </Grid>
        <Grid item xs={6}>
          <TextDetail label={'email'} value={userData?.email} />
        </Grid>
        <Grid item xs={6}>
          <TextDetail label={'phone'} value={userData?.phone} />
        </Grid>
        <Grid item xs={6}>
          <TextDetail
            label={'full_address'}
            value={userData?.company?.street}
          />
        </Grid>
        <Grid item xs={3}>
          <TextDetail
            label={'postal_code'}
            value={userData?.company?.postal_code}
          />
        </Grid>
        <Grid item xs={3}>
          <TextDetail label={'city'} value={userData?.company?.city} />
        </Grid>
      </Grid>
      <Typography
        marginTop={'2rem'}
        variant="h6"
        color={'grey.800'}
        fontWeight={'500'}
      >
        {t('company_information')}
      </Typography>

      <Grid container spacing={2} marginTop={'1rem'}>
        <Grid item xs={6}>
          <TextDetail label={'Nom'} value={userData?.company?.name} />
        </Grid>
        <Grid item xs={6}>
          <TextDetail label={'type_society'} value={userData?.company?.type} />
        </Grid>
        <Grid item xs={6}>
          <TextDetail
            label={'fiscal_number'}
            value={userData?.company?.fiscal_number}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserInformation;
