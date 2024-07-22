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
import { buyerSellerFormSchema } from '@/form-schemas/buyerSellerFormSchema';
import userPanelServices from '@/services/userPanel.service';
import showNotification from '@components/atoms/Notification';
import { ISellerForm } from '@/interfaces/buyerAndSellerts';
import { useTranslation } from 'react-i18next';

interface ISellerFormProps {
  seller: any;
  onSucceed: () => void;
  countries: ICountry[];
}

const sellerFormDefaultValues: ISellerForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  postal_code: '',
  city: '',
  country: ''
};
const BuyerForm: FC<ISellerFormProps> = ({ seller, onSucceed, countries }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    control: buyerControl,
    handleSubmit: handleBuyerSubmit,
    formState: { errors: buyerErrors }
  } = useForm<ISellerForm>({
    defaultValues: seller || sellerFormDefaultValues,
    // @ts-ignore
    resolver: yupResolver(buyerSellerFormSchema)
  });
  const { t } = useTranslation();

  const put = async (data: any) => {
    try {
      setLoading(true);
      const response = await userPanelServices.updateSellerInformation(
        seller.id,
        data
      );
      if (response.status === 200 || response.status === 201) {
        setLoading(false);
        showNotification({
          message: t('seller_change_success'),
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
              control={buyerControl}
              render={({ field: { value, onChange } }) => (
                <>
                  <TextField
                    label={t('comp_name')}
                    value={value}
                    onChange={onChange}
                    helperText={buyerErrors.name?.message}
                    placeholder={`${t('comp_name')} 1`}
                    error={!!buyerErrors.name}
                  />
                </>
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
              control={buyerControl}
              render={({ field: { value, onChange } }) => (
                <>
                  <Select
                    value={value}
                    onChange={onChange}
                    placeholder={t('country')}
                    error={!!buyerErrors.country}
                    labelId="demo-simple-select-outlined-label"
                    displayEmpty
                    IconComponent={() => <KeyboardArrowDownRounded />}
                  >
                    <MenuItem value="" disabled>
                      {t('choose')}
                    </MenuItem>
                    {countries.map((country) => (
                      <MenuItem key={country.id} value={country.id}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                </>
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
              control={buyerControl}
              render={({ field: { value, onChange } }) => (
                <>
                  <TextField
                    label={t('email')}
                    value={value}
                    onChange={onChange}
                    placeholder="mail@mail.com"
                    helperText={buyerErrors.email?.message}
                    error={!!buyerErrors.email}
                  />
                </>
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
              control={buyerControl}
              render={({ field: { value, onChange } }) => (
                <>
                  <TextField
                    label={t('phone')}
                    value={value}
                    onChange={onChange}
                    helperText={buyerErrors.phone?.message}
                    placeholder={t('phone')}
                    error={!!buyerErrors.phone}
                  />
                </>
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
              control={buyerControl}
              render={({ field: { value, onChange } }) => (
                <>
                  <TextField
                    label={t('address')}
                    value={value}
                    onChange={onChange}
                    placeholder={t('address')}
                    helperText={buyerErrors.address?.message}
                    error={!!buyerErrors.address}
                  />
                </>
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
              control={buyerControl}
              render={({ field: { value, onChange } }) => (
                <>
                  <TextField
                    label={t('postal_code')}
                    value={value}
                    onChange={onChange}
                    placeholder={t('postal_code')}
                    helperText={buyerErrors.postal_code?.message}
                    error={!!buyerErrors.postal_code}
                  />
                </>
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
              control={buyerControl}
              render={({ field: { value, onChange } }) => (
                <>
                  <TextField
                    label={t('city')}
                    value={value}
                    onChange={onChange}
                    placeholder={t('city')}
                    helperText={buyerErrors.city?.message}
                    error={!!buyerErrors.city}
                  />
                </>
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

export default BuyerForm;
