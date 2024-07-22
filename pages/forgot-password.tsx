import React, { useEffect, useRef } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { Box, Button, Typography } from '@mui/material';

import { Head } from '@/components/atoms/Head';
import Image from 'next/image';
import { PasswordOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { TextInput } from '@/components/atoms/TextInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordSchema } from '@/form-schemas/forgotPasswordSchema';
import authService from '@/services/auth.service';
import showNotification from '@/components/atoms/Notification';
import { useAppDispatch } from '@/hooks/redux';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { logIn } from '@/store/users/reducer';
import { useTranslation } from 'react-i18next';
export interface IForgotPasswordForm {
  email: string;
}

const defaultForgotValues: IForgotPasswordForm = {
  email: ''
};

const ForgotPasswordPage: NextPage = () => {
  /*hooks*/
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, i18n } = useTranslation();

  const {
    reset: forgotReset,
    control: forgotControl,
    handleSubmit: handleForgotSubmit,

    formState: { errors: forgotErrors }
  } = useForm<IForgotPasswordForm>({
    defaultValues: defaultForgotValues,
    // @ts-ignore
    resolver: yupResolver(forgotPasswordSchema)
  });

  const sendEmail = async (data) => {
    try {
      const response = await authService.forgotPassword(data);

      if (response.status === 200) {
        forgotReset();
        return showNotification({
          type: 'success',
          message: t('email_sending_success'),
          timeout: 2000
        });
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

  useEffect(() => {
    dispatch(
      logIn({
        loggedIn: false,
        email: ''
      })
    );
  }, []);

  return (
    <>
      <Head title="Login" />
      <form
        key={0}
        style={{ marginBottom: '5rem' }}
        className="flex flex-col items-center w-[324px] mx-1"
        onSubmit={handleForgotSubmit(sendEmail)}
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

          <PasswordOutlined sx={{ fontSize: '28px' }} />
          <Typography variant={'h6'} sx={{ mb: '0.2rem' }}>
            {t('forgot_password')}
          </Typography>
          <Typography
            variant={'body2'}
            sx={{ mb: '1.5rem', textAlign: 'center', color: 'grey.700' }}
          >
            {t('enter_password')}
          </Typography>
          <Box sx={{ width: '100%' }}>
            <TextInput
              name="email"
              control={forgotControl}
              label="email"
              placeholder="mail@mail.com"
              inputRef={inputRef}
              labelForError="email"
              helperText={forgotErrors?.email?.message ?? ''}
              error={!!forgotErrors.email}
            />
          </Box>

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

export const getServerSideProps: GetServerSideProps<any> = async ({
  locale
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export default ForgotPasswordPage;
