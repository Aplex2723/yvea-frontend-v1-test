import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';

export const LanguageSelector: React.FC<any> = () => {
  const router = useRouter();

  const { i18n } = useTranslation();

  const pickLanguage = () => {
    if (i18n?.language == 'en') {
      router.push(router.asPath, undefined, { locale: 'fr' });
      return i18n.changeLanguage('fr');
    }
    if (i18n?.language == 'fr') {
      router.push(router.asPath, undefined, { locale: 'en' });
      return i18n.changeLanguage('en');
    }
  };

  return (
    <Box
      display={'flex'}
      position={'fixed'}
      top={'1%'}
      right={'5%'}
      zIndex={'1300'}
    >
      <IconButton onClick={() => pickLanguage()}>
        <LanguageIcon />
        {i18n?.language == 'en' && (
          <>
            {' '}
            <Typography>{'Eng'}</Typography>
          </>
        )}
        {i18n?.language == 'fr' && (
          <>
            {' '}
            <Typography>{'Fr'}</Typography>
          </>
        )}
      </IconButton>
    </Box>
  );
};
