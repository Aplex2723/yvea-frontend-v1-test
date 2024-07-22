import React, { FC, useState } from 'react';
import {
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { KeyboardArrowDownRounded } from '@mui/icons-material';
import { ICountry } from '@/interfaces/common';
import { placeFormSchema } from '@/form-schemas/buyerSellerFormSchema';
import userPanelServices from '@/services/userPanel.service';
import showNotification from '@components/atoms/Notification';
import { IPlaceForm } from '@/interfaces/buyerAndSellerts';
import { useTranslation } from 'react-i18next';

interface IPlaceFormProps {
  place: any;
  onSucceed: () => void;
  countries: ICountry[];
}

const placeFormDefaultValues: IPlaceForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  postal_code: '',
  city: '',
  country: '',
  contact_name: '',
  contact_lastname: ''
};
const EditPlaceForm: FC<IPlaceFormProps> = ({
  place,
  onSucceed,
  countries
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const {
    control: placeControl,
    handleSubmit: handleBuyerSubmit,
    formState: { errors: placeErrors }
  } = useForm<IPlaceForm>({
    defaultValues: place || placeFormDefaultValues,
    // @ts-ignore
    resolver: yupResolver(placeFormSchema)
  });

  const put = async (data: any) => {
    try {
      setLoading(true);
      const response = await userPanelServices.updatePlaceInformation(
        place.id,
        data
      );
      if (response.status === 200 || response.status === 201) {
        setLoading(false);
        showNotification({
          message: t('inspection_change_success'),
          type: 'success',
          timeout: 3000
        });
        onSucceed();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleBuyerSubmit(put)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            variant={'body2'}
            sx={{ fontSize: '15px', mb: '.5rem', pl: '.2rem' }}
          >
            {t('comp_name')}
          </Typography>
          <FormControl fullWidth>
            <Controller
              name={'name'}
              control={placeControl}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label={t('comp_name')}
                  value={value}
                  onChange={onChange}
                  helperText={placeErrors.name?.message}
                  placeholder={`${t('comp_name')} 1`}
                  error={!!placeErrors.name}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant={'body2'}
            sx={{ fontSize: '15px', mb: '.5rem', pl: '.2rem' }}
          >
            {t('select_country')}
          </Typography>
          <FormControl fullWidth>
            <Controller
              name={'country'}
              control={placeControl}
              render={({ field: { value, onChange } }) => (
                <Select
                  value={value}
                  onChange={onChange}
                  placeholder={t('country')}
                  error={!!placeErrors.country}
                  labelId="demo-simple-select-outlined-label"
                  displayEmpty
                  IconComponent={() => <KeyboardArrowDownRounded />}
                >
                  <MenuItem value="" disabled>
                    {t('choose')}
                  </MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                      {t(country.name)}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant={'body2'}
            sx={{ fontSize: '15px', mb: '.5rem', pl: '.2rem' }}
          >
            {t('email')}
          </Typography>
          <FormControl fullWidth>
            <Controller
              name={'email'}
              control={placeControl}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label={t('email')}
                  value={value}
                  onChange={onChange}
                  placeholder="mail@mail.com"
                  helperText={placeErrors.email?.message}
                  error={!!placeErrors.email}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant={'body2'}
            sx={{ fontSize: '15px', mb: '.5rem', pl: '.2rem' }}
          >
            {t('phone')}
          </Typography>
          <FormControl fullWidth>
            <Controller
              name={'phone'}
              control={placeControl}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label={t('phone')}
                  value={value}
                  onChange={onChange}
                  helperText={placeErrors.phone?.message}
                  placeholder={t('phone')}
                  error={!!placeErrors.phone}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant={'body2'}
            sx={{ fontSize: '15px', mb: '.5rem', pl: '.2rem' }}
          >
            {t('address')}
          </Typography>
          <FormControl fullWidth>
            <Controller
              name={'address'}
              control={placeControl}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label={t('address')}
                  value={value}
                  onChange={onChange}
                  placeholder={t('address')}
                  helperText={placeErrors.address?.message}
                  error={!!placeErrors.address}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant={'body2'}
            sx={{ fontSize: '15px', mb: '.5rem', pl: '.2rem' }}
          >
            {t('postal_code')}
          </Typography>
          <FormControl fullWidth>
            <Controller
              name={'postal_code'}
              control={placeControl}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label={t('postal_code')}
                  value={value}
                  onChange={onChange}
                  placeholder={t('postal_code')}
                  helperText={placeErrors.postal_code?.message}
                  error={!!placeErrors.postal_code}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant={'body2'}
            sx={{ fontSize: '15px', mb: '.5rem', pl: '.2rem' }}
          >
            {t('city')}
          </Typography>
          <FormControl fullWidth>
            <Controller
              name={'city'}
              control={placeControl}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label={t('city')}
                  value={value}
                  onChange={onChange}
                  placeholder={t('city')}
                  helperText={placeErrors.city?.message}
                  error={!!placeErrors.city}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant={'body2'}
            sx={{ fontSize: '15px', mb: '.5rem', pl: '.2rem' }}
          >
            {t('contact_ft_name')}
          </Typography>
          <FormControl fullWidth>
            <Controller
              name={'contact_name'}
              control={placeControl}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label={t('contact_ft_name')}
                  value={value}
                  onChange={onChange}
                  placeholder={t('contact_ft_name')}
                  helperText={placeErrors.contact_name?.message}
                  error={!!placeErrors.city}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant={'body2'}
            sx={{ fontSize: '15px', mb: '.5rem', pl: '.2rem' }}
          >
            {t('contact_name_two')}
          </Typography>
          <FormControl fullWidth>
            <Controller
              name={'contact_lastname'}
              control={placeControl}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label={t('contact_name_two')}
                  value={value}
                  onChange={onChange}
                  placeholder={t('contact_name_two')}
                  helperText={placeErrors.contact_lastname?.message}
                  error={!!placeErrors.contact_lastname}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ mt: '.5rem' }}>
          <LoadingButton
            variant={'contained'}
            fullWidth
            loading={loading}
            disabled={loading}
            color={'secondary'}
            type={'submit'}
          >
            {t('confirmer')}
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default EditPlaceForm;
