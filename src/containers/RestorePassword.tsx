import React from 'react';
import type { NextPage } from 'next';
import { Box, Typography, Grid, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { Head } from '@/components/atoms/Head';
import { PasswordInput } from '@/components/atoms/PasswordInput';
import { Controller, useForm } from 'react-hook-form';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { restorePasswordSchema } from '@/form-schemas/restorePasswordSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import authService from '@/services/auth.service';
import showNotification from '@/components/atoms/Notification';
import { useTranslation } from 'react-i18next';

export interface IRestorePasswordForm {
  password: string;
  confirmPassword: string;
}

const defaultRestorePassword: IRestorePasswordForm = {
  password: '',
  confirmPassword: ''
};

const RestorePassword: NextPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const { t, i18n } = useTranslation();

  const {
    control: restoreControl,
    handleSubmit,
    getValues,
    formState: { errors: restoreErrors }
  } = useForm<IRestorePasswordForm>({
    defaultValues: defaultRestorePassword,
    // @ts-ignore
    resolver: yupResolver(restorePasswordSchema)
  });

  const resetPassword = async () => {
    const formValues = getValues();
    const payload = {
      password: formValues.password,
      token: token
    };

    try {
      const response = await authService.restorePassword(payload);

      if (response.status === 200) {
        showNotification({
          type: 'success',
          message: t('revocer_password_success'),
          timeout: 2000
        });
        return router.push('/');
      }
    } catch (e) {
      if (
        e.response.status === 400 ||
        e.response.status === 404 ||
        e.response.status === 401
      ) {
        return showNotification({
          type: 'error',
          message: e?.response?.data?.message,
          timeout: 2000
        });
      }
    }
  };

  return (
    <>
      <Head title="Restore password" />
      <form
        key={0}
        style={{ marginBottom: '5rem' }}
        className="flex flex-col items-center w-[324px] mx-1"
        onSubmit={handleSubmit(resetPassword)}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{
            width: { xs: '90%', md: '30%', lg: '25%' },
            margin: '10rem auto'
          }}
        >
          <Box width={'100%'} marginBottom={'3rem'}>
            <Image
              src={i18n.language==='en'?'/icons/en_logo.svg':'/icons/fr_logo.svg'}
              alt={'ezxport en_logo'}
              width={0}
              height={0}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </Box>
          <Grid container flexDirection={'column'} spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={restoreControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Box width={'100%'}>
                    <Typography
                      color={'text.secondary'}
                      variant={'body2'}
                      mb={'-10px'}
                    >
                      {t('password')}
                    </Typography>
                    <PasswordInput
                      value={value}
                      onChange={onChange}
                      error={!!restoreErrors?.password}
                    />
                  </Box>
                )}
              />
              {!!restoreErrors?.password && (
                <ErrorMessage
                  content={restoreErrors?.password?.message ?? ''}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="confirmPassword"
                control={restoreControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Box width={'100%'}>
                    <Typography
                      color={'text.secondary'}
                      variant={'body2'}
                      mb={'-10px'}
                    >
                      {`${t('confirm_password')} *`}
                    </Typography>
                    <PasswordInput
                      value={value}
                      onChange={onChange}
                      error={!!restoreErrors?.confirmPassword}
                    />
                  </Box>
                )}
              />
              {!!restoreErrors?.confirmPassword && (
                <ErrorMessage
                  content={restoreErrors?.confirmPassword?.message ?? ''}
                />
              )}
            </Grid>
          </Grid>
          <Box marginY={2} width="100%">
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              sx={{ textTransform: 'Capitalize' }}
              fullWidth
            >
              {t('reset')}
            </Button>
          </Box>
        </Box>
      </form>
    </>
  );
};

export default RestorePassword;
