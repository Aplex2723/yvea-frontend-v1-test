import React, { useEffect, useRef } from 'react';
import {
  Box,
  CircularProgress,
  Tooltip,
  Typography,
  styled
} from '@mui/material';
import {
  BackupOutlined,
  HelpOutline,
  DeleteOutline
} from '@mui/icons-material';
import { Controller } from 'react-hook-form';
import { ErrorMessage } from './ErrorMessage';
import { useTranslation } from 'react-i18next';

const InputFileContainer = styled(Box)((theme) => ({
  border: '1px solid',
  borderColor: theme.theme.palette.grey['200'],
  height: '9rem',
  marginTop: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  borderRadius: '8px'
}));

interface IInputFileProps {
  name: string;
  control: any;
  tooltipMessage: string;
  inputRef?: any;
  loading?: boolean;
  fileMethod: (file) => void;
  deleteMethod: () => void;
  externalName?: any;
  label?: string;
  error: boolean;
  errorMessage: string;
}

export const InputFile: React.FC<IInputFileProps> = ({
  name,
  tooltipMessage,
  control,
  loading,
  fileMethod,
  externalName = null,
  label,
  error,
  errorMessage,
  deleteMethod
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    ref.current.value = null;
  }, [externalName]);

  const handleUpload = (file: File) => {
    externalName = file?.name;
    fileMethod(file);
  };

  const deleteFiles = () => {
    deleteMethod();
    ref.current.value = null;
    externalName = null;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={() => (
        <>
          <Box display={'flex'} alignItems={'center'}>
            <Typography
              variant={'body2'}
              sx={{ fontSize: '16px', color: 'grey.700' }}
            >
              {label}
            </Typography>
            <Tooltip title={tooltipMessage}>
              <HelpOutline
                sx={{
                  fontSize: '16px',
                  ml: '.5rem',
                  cursor: 'pointer'
                }}
              />
            </Tooltip>
          </Box>
          <input
            type={'file'}
            ref={ref}
            hidden
            accept={'.jpg, .jpeg, .png, .pdf'}
            id={`actual-btn-${name}`}
            onChange={(event: any) => handleUpload(event.target.files[0])}
          />

          <InputFileContainer>
            <Box
              borderRadius={'100%'}
              height={'3.5rem'}
              width={'3.5rem'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              bgcolor={'grey.50'}
              sx={{
                cursor: 'pointer',

                '&:hover': {
                  backgroundColor: 'grey.100'
                }
              }}
            >
              {externalName ? (
                <Box
                  borderRadius={'100%'}
                  height={'2.7rem'}
                  width={'2.7rem'}
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  bgcolor={'grey.100'}
                  sx={{
                    cursor: 'pointer',

                    '&:hover': {
                      backgroundColor: 'grey.100'
                    }
                  }}
                  onClick={() => deleteFiles()}
                >
                  <DeleteOutline sx={{ color: 'grey.600', fontSize: '25px' }} />
                </Box>
              ) : (
                <label htmlFor={`actual-btn-${name}`}>
                  <Box
                    borderRadius={'100%'}
                    height={'2.7rem'}
                    width={'2.7rem'}
                    display={'flex'}
                    sx={{
                      cursor: 'pointer',

                      '&:hover': {
                        backgroundColor: 'grey.100'
                      }
                    }}
                    justifyContent={'center'}
                    alignItems={'center'}
                    bgcolor={'grey.100'}
                  >
                    {loading ? (
                      <CircularProgress
                        color="primary"
                        variant="indeterminate"
                      />
                    ) : (
                      <BackupOutlined
                        sx={{ color: 'grey.600', fontSize: '25px' }}
                      />
                    )}
                  </Box>
                </label>
              )}
            </Box>
            {!externalName ? (
              <Typography color={'grey.500'} mt={'1.5rem'}>
                <span style={{ color: '#1B019B', fontWeight: 'bold' }}>
                  {t('click_here')}{' '}
                </span>
                {t('file_formats')}
              </Typography>
            ) : (
              <Typography color={'grey.500'} mt={'1.5rem'}>
                {externalName || externalName?.name || ''}
              </Typography>
            )}
            {error && <ErrorMessage content={errorMessage} />}
          </InputFileContainer>
        </>
      )}
    />
  );
};
