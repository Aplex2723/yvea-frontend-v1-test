import React, { useState, FC } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';

type Props = {
  confirm?: boolean;
  value?: string;
  error: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const PasswordInput: FC<Props> = ({
                                           value,
                                           onChange,
                                           error
                                         }) => {
  /*
   hooks
  * */
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <TextField
      type={showPassword ? 'text' : 'password'}
      fullWidth
      value={value}
      onChange={onChange}
      placeholder={'Mot de passe'}
      margin="normal"
      error={error}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? (
                <VisibilityOffOutlined />
              ) : (
                <VisibilityOutlined />
              )}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
};
