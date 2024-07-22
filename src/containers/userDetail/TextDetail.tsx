import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const TextDetail = ({ label, value }: any) => {
  const { t } = useTranslation();
  return (
    <Box flexDirection="column">
      <Typography
        marginBottom={'1rem'}
        variant="body2"
        color={'text.secondary'}
        fontWeight={'500'}
      >
        {t(label)}
      </Typography>
      <Typography variant="body1" color={'grey.800'} fontWeight={'700'}>
        {value ?? '-'}
      </Typography>
    </Box>
  );
};
