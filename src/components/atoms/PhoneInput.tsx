import React from 'react';
import { Box, Typography } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Controller } from 'react-hook-form';
import { ErrorMessage } from './ErrorMessage';
import { useTranslation } from 'react-i18next';

interface ICustomPhoneProps {
  name: string;
  control: any;
  error: boolean;
  inputRef: any;
  label: string;
  isRequired?: boolean;
  placeholder?: string;
  helperText: string;
  onChange?: any;
  disabled?: boolean;
  labelForError: string;
}

export const CustomPhoneInput: React.FC<ICustomPhoneProps> = ({
  name,
  control,
  error,
  label,
  isRequired = true,
  onChange,
  helperText,
  disabled,
  labelForError
}) => {
  // const handleOnChange = (_value, _data, _event, formattedValue) => {
  //   return formattedValue;
  // };
  const { t } = useTranslation();
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: isRequired }}
      render={({ field: { value } }) => (
        <Box width={'100%'}>
          <Typography color={'text.secondary'} variant={'body2'} mb={'6px'}>
            {label}
          </Typography>

          <PhoneInput
            value={value}
            country={'fr'}
            autoFormat={false}
            enableSearch
            inputStyle={!disabled ? style.input : style.inputDisabled}
            containerStyle={style.container}
            buttonStyle={!disabled ? style.button : style.buttonDisabled}
            dropdownStyle={style.dropdown}
            showDropdown={false}
            onChange={onChange}
            disableDropdown={disabled}
            disabled={disabled}
          />

          {!!error && (
            <ErrorMessage
              content={
                error ? t(helperText, { field: t(labelForError) }) : null
              }
            />
          )}
        </Box>
      )}
    />
  );
};

const style: any = {
  input: {
    minWidth: '70px',
    borderRadius: '8px',
    padding: '10px 15px',
    height: '50px',
    width: '100%',
    marginLeft: '2rem'
  },
  inputDisabled: {
    minWidth: '70px',
    borderRadius: '8px',
    padding: '10px 15px',
    height: '50px',
    width: '100%',
    marginLeft: '2rem',
    background: '#D0D5DD',
    color: '#667085'
  },
  button: {
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px'
  },
  buttonDisabled: {
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
    background: '#D0D5DD',
    color: '#667085'
  },
  dropdown: {
    borderRadius: '4px'
  }
};
