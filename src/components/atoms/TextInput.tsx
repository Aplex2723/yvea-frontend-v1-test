import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';

interface ITextInputProps {
  name: string;
  control: any;
  error: boolean;
  inputRef: any;
  label: string;
  isRequired?: boolean;
  placeholder?: string;
  helperText: string;
  labelForError: string;
}

export const TextInput: React.FC<ITextInputProps> = ({
  name,
  control,
  error,
  inputRef,
  label,
  isRequired = true,
  placeholder,
  helperText,
  labelForError
}) => {
  const { t } = useTranslation();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: isRequired }}
      render={({ field: { value, onChange } }) => (
        <Box width={'100%'}>
          <Typography color={'text.secondary'} variant={'body2'} mb={'-10px'}>
            {t(label)}
          </Typography>
          <TextField
            placeholder={t(placeholder)}
            value={value}
            onChange={onChange}
            error={error}
            margin="normal"
            helperText={
              error ? t(helperText, { field: t(labelForError) }) : null
            }
            fullWidth
            inputRef={inputRef}
          />
        </Box>
      )}
    />
  );
};
