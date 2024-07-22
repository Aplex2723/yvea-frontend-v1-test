import React, { useEffect, useRef } from 'react';
import type { NextPage } from 'next';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { PasswordInput } from '@/components/atoms/PasswordInput';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import authService from '@/services/auth.service';
import { registerSchema } from '@/form-schemas/registerSchema';
import { Head } from '@/components/atoms/Head';

import { KeyboardArrowDownRounded } from '@mui/icons-material';
import { TextInput } from '@/components/atoms/TextInput';
import { typeOfBussines, worldCountries } from '../../../utils/common';

import Link from 'next/link';
import { CustomPhoneInput } from '@/components/atoms/PhoneInput';
import showNotification from '@/components/atoms/Notification';
import { useAppDispatch } from '@/hooks/redux';
import { logIn } from '@/store/users/reducer';
import { useTranslation } from 'react-i18next';

export interface IRegisterForm {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  name: string;
  fiscal_number: string;
  street: string;
  postal_code: string;
  city: string;
  country: string;
  type: string;
  confirmPassword: string;
  termsCondition: boolean;
  termsService: boolean;
  termsPrivacy: boolean;
}

const defaultRegisterValues: IRegisterForm = {
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  phone: '',
  name: '',
  fiscal_number: '',
  street: '',
  postal_code: '',
  city: '',
  country: '',
  type: '',
  confirmPassword: '',
  termsCondition: false,
  termsService: false,
  termsPrivacy: false
};

const Register: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const {
    setValue,
    setError,
    reset: registerReset,
    control: registerControl,
    handleSubmit: handleRegisterSubmit,
    getValues: getRegisterValues,
    formState: { errors: registerErrors }
  } = useForm<IRegisterForm>({
    defaultValues: defaultRegisterValues,
    // @ts-ignore
    resolver: yupResolver(registerSchema)
  });

  const register = async () => {
    const formValues = getRegisterValues();
    if (
      !formValues.termsCondition ||
      !formValues?.termsService ||
      !formValues?.termsPrivacy
    )
      return showNotification({
        type: 'error',
        message: t('please_accept_terms'),
        timeout: 2000
      });

    try {
      const payload = {
        email: formValues.email,
        password: formValues.password,
        first_name: formValues.first_name,
        last_name: formValues.last_name,
        phone: formValues.phone,
        company: {
          name: formValues.name,
          fiscal_number: formValues.fiscal_number ?? undefined,
          street: formValues.street,
          postal_code: formValues.postal_code,
          city: formValues.city,
          country: formValues.country,
          type: formValues.type
        }
      };

      const response = await authService.register(payload);

      if (response.status === 201) {
        registerReset();
        showNotification({
          type: 'success',
          message: t('verification_email_sent'),
          timeout: 5000
        });
        await router.push('/');
      }
    } catch (e) {
      if (
        e.response.status === 400 ||
        e.response.status === 404 ||
        e.response.status === 401
      ) {
        if(e?.response?.data?.errors && e?.response?.data?.errors.join(',').includes('password')){
          setError('password',{
            type: 'manual',
            message: t('password_not_strong')
          })
        }
        return showNotification({
          type: 'error',
          message: e?.response?.data?.errors ? e?.response?.data?.errors.join(',') : e?.response?.data?.message,
          timeout: 4000
        });
        // setErrorMessage(e?.response?.data?.message?.[0]);
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
      <Head title="Register" />

      <Box padding={'2rem'} sx={{ minHeight: '100vh' }}>
        {/*form stepper container*/}
        <Box
          sx={{
            width: { md: '100%', lg: '80%' },
            paddingTop: '2rem',
            height: 'auto',
            margin: 'auto'
          }}
        >
          <form
            key={0}
            style={{ marginBottom: '5rem' }}
            className="flex flex-col items-center w-[324px] mx-1"
            onSubmit={handleRegisterSubmit(register)}
          >
            <Typography
              color={'text.primary'}
              marginBottom={'1rem'}
              fontWeight={'600'}
            >
              {t('user_information')}
            </Typography>

            <Grid container spacing={3.5}>
              <Grid item xs={6}>
                <TextInput
                  name="first_name"
                  control={registerControl}
                  label={`${t('name')} *`}
                  placeholder="name"
                  inputRef={inputRef}
                  labelForError="name"
                  helperText={registerErrors?.last_name?.message ?? ''}
                  error={!!registerErrors.last_name}
                />
              </Grid>
              <Grid item xs={6}>
                <TextInput
                  name="last_name"
                  control={registerControl}
                  label={`${t('last_name')} *`}
                  placeholder="last_name"
                  labelForError="last_name"
                  inputRef={inputRef}
                  helperText={registerErrors?.first_name?.message ?? ''}
                  error={!!registerErrors.first_name}
                />
              </Grid>
              <Grid item xs={6}>
                <TextInput
                  name="email"
                  control={registerControl}
                  label={`${t('email')} *`}
                  placeholder="mail@mail.com"
                  labelForError="email"
                  inputRef={inputRef}
                  helperText={registerErrors?.email?.message ?? ''}
                  error={!!registerErrors.email}
                />
              </Grid>
              <Grid item xs={5.7}>
                <CustomPhoneInput
                  name="phone"
                  control={registerControl}
                  label={`${t('phone')} *`}
                  inputRef={inputRef}
                  labelForError="phone"
                  helperText={registerErrors?.phone?.message ?? ''}
                  onChange={(value) => {
                    setValue('phone', value);
                  }}
                  error={!!registerErrors.phone}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="password"
                  control={registerControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Box width={'100%'}>
                      <Typography
                        color={'text.secondary'}
                        variant={'body2'}
                        mb={'-10px'}
                      >
                        {`${t('password')} *`}
                      </Typography>
                      <PasswordInput
                        value={value}
                        onChange={onChange}
                        error={!!registerErrors?.password}
                      />
                    </Box>
                  )}
                />
                {!!registerErrors?.password && (
                  <ErrorMessage
                    content={t(registerErrors?.password?.message ?? '', {
                      field: t('password')
                    })}
                  />
                )}
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="confirmPassword"
                  control={registerControl}
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
                        error={!!registerErrors?.confirmPassword}
                      />
                    </Box>
                  )}
                />
                {!!registerErrors?.confirmPassword && (
                  <ErrorMessage
                    content={t(registerErrors?.confirmPassword?.message ?? '', {
                      field: t('confirm_password')
                    })}
                  />
                )}
              </Grid>
            </Grid>

            <Typography
              color={'text.primary'}
              marginBottom={'1rem'}
              marginTop={'1rem'}
              fontWeight={'600'}
            >
              {t('company_information')}
            </Typography>

            <Grid container spacing={3.5}>
              <Grid item xs={6}>
                <TextInput
                  name="name"
                  control={registerControl}
                  label={`${t('name')} *`}
                  placeholder="name"
                  helperText={registerErrors?.name?.message ?? ''}
                  inputRef={inputRef}
                  labelForError="name"
                  error={!!registerErrors.name}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography
                  color={'text.secondary'}
                  variant={'body2'}
                  mb={'6px'}
                >
                  {`${t('type_society')} *`}
                </Typography>
                <FormControl fullWidth>
                  <Controller
                    name={'type'}
                    control={registerControl}
                    render={({ field: { value, onChange } }) => (
                      <FormControl fullWidth>
                        <Select
                          value={value}
                          onChange={onChange}
                          placeholder="type_society"
                          error={!!registerErrors.type}
                          labelId="country-label"
                          IconComponent={() => <KeyboardArrowDownRounded />}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            {`${t('choose')}`}
                          </MenuItem>
                          {typeOfBussines.map((businnes) => (
                            <MenuItem key={businnes.name} value={businnes.id}>
                              {t(businnes.name)}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!registerErrors.type && (
                          <Typography color={'red'} fontSize={'14px'}>
                            {t(registerErrors.type?.message ?? '', {
                              field: t('type_society')
                            })}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <TextInput
                  name="street"
                  control={registerControl}
                  label={`${t('full_address')} *`}
                  placeholder="90 chaussée de rouvroy"
                  inputRef={inputRef}
                  labelForError="full_address"
                  helperText={registerErrors?.street?.message ?? ''}
                  error={!!registerErrors.street}
                />
              </Grid>
              <Grid item xs={3}>
                <TextInput
                  name="postal_code"
                  control={registerControl}
                  label={`${t('postal_code')} *`}
                  placeholder="80100"
                  labelForError="postal_code"
                  inputRef={inputRef}
                  helperText={registerErrors?.postal_code?.message ?? ''}
                  error={!!registerErrors.postal_code}
                />
              </Grid>
              <Grid item xs={3}>
                <TextInput
                  name="city"
                  control={registerControl}
                  label={`${t('city')} *`}
                  placeholder="Abbeville"
                  labelForError="city"
                  inputRef={inputRef}
                  helperText={registerErrors?.city?.message ?? ''}
                  error={!!registerErrors.city}
                />
              </Grid>
              <Grid item xs={6}>
                <TextInput
                  name="fiscal_number"
                  control={registerControl}
                  label={`${t('fiscal_number')} *`}
                  placeholder="6372890367849"
                  inputRef={inputRef}
                  labelForError="fiscal_number"
                  helperText={registerErrors?.name?.message ?? ''}
                  error={!!registerErrors.name}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Typography sx={{ fontSize: '13px', mb: '7px' }}>
                    {`${t('country')} *`}
                  </Typography>
                  <Controller
                    name={'country'}
                    control={registerControl}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        value={value}
                        onChange={onChange}
                        placeholder={`${t('country')}`}
                        error={!!registerErrors.country}
                        labelId="demo-simple-select-outlined-label"
                        displayEmpty
                        IconComponent={() => <KeyboardArrowDownRounded />}
                      >
                        <MenuItem value="" disabled>
                          {`${t('choose')}`}
                        </MenuItem>
                        {worldCountries.map((country) => (
                          <MenuItem
                            key={country.id}
                            value={country.name.toUpperCase()}
                          >
                            {t(country.name)}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
                {!!registerErrors.country && (
                  <Typography color={'red'} fontSize={'14px'}>
                    {t(registerErrors.country?.message, {
                      field: t('country')
                    })}
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Box
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'flex-start'}
              alignItems={'flex-start'}
              marginLeft={'-0.5rem'}
            >
              <FormControl>
                <Box
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  marginTop={'1rem'}
                >
                  <Controller
                    name={'termsCondition'}
                    control={registerControl}
                    render={({ field }) => (
                      <>
                        <Checkbox
                          checked={field.value}
                          color={'secondary'}
                          sx={{
                            color: 'secondary.50',
                            '&.Mui-checked': {
                              color: 'secondary.main'
                            }
                          }}
                          onChange={field.onChange}
                        />

                        <Box display={'flex'}>
                          <Typography
                            variant={'body2'}
                            sx={{
                              fontSize: '16px',
                              color: 'secondary.500',
                              textDecoration: 'underline',
                              cursor: 'pointer'
                            }}
                          >
                            <Link
                              href={'https://yvea.io/fr/contracts/cgu'}
                              target="_blank"
                            >
                              {' '}
                              {`${t('terms_of_use')}`}
                            </Link>
                          </Typography>
                        </Box>
                      </>
                    )}
                  />
                </Box>
              </FormControl>

              <FormControl>
                <Box
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <Controller
                    name={'termsService'}
                    control={registerControl}
                    render={({ field }) => (
                      <>
                        <Checkbox
                          checked={field.value}
                          color={'secondary'}
                          sx={{
                            color: 'secondary.50',
                            '&.Mui-checked': {
                              color: 'secondary.main'
                            }
                          }}
                          onChange={field.onChange}
                        />

                        <Box display={'flex'}>
                          <Typography
                            variant={'body2'}
                            sx={{
                              fontSize: '16px',
                              color: 'secondary.500',
                              textDecoration: 'underline',
                              cursor: 'pointer'
                            }}
                          >
                            <Link
                              href={'https://yvea.io/fr/contracts/cgv'}
                              target="_blank"
                            >
                              {`${t('terms_of_condition')}`}
                            </Link>
                          </Typography>
                        </Box>
                      </>
                    )}
                  />
                </Box>
              </FormControl>
              <FormControl>
                <Box
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <Controller
                    name={'termsPrivacy'}
                    control={registerControl}
                    render={({ field }) => (
                      <>
                        <Checkbox
                          checked={field.value}
                          color={'secondary'}
                          sx={{
                            color: 'secondary.50',
                            '&.Mui-checked': {
                              color: 'secondary.main'
                            }
                          }}
                          onChange={field.onChange}
                        />

                        <Box display={'flex'}>
                          <Typography
                            variant={'body2'}
                            sx={{
                              fontSize: '16px',
                              color: 'secondary.500',
                              textDecoration: 'underline',
                              cursor: 'pointer'
                            }}
                          >
                            <Link
                              href={'https://yvea.io/fr/contracts/privacy'}
                              target="_blank"
                            >
                              {`${t('term_of_policy')}`}
                            </Link>
                          </Typography>
                        </Box>
                      </>
                    )}
                  />
                </Box>
              </FormControl>
            </Box>

            <Box
              marginY={6}
              width="100%"
              display={'flex'}
              justifyContent={'center'}
            >
              <Box width={'40%'}>
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  sx={{ textTransform: 'Capitalize' }}
                  fullWidth
                >
                  {t('register')}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default Register;
