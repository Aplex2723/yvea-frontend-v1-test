import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface IErrorMessageProps {
  content: string;
}

export const ErrorMessage: React.FC<IErrorMessageProps> = ({ content }) => {
  const { t } = useTranslation();

  return (
    <Typography variant="body2" color={'error'} width="100%">
      {t(content)}
    </Typography>
  );
};
