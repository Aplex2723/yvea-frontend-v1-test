import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { KeyboardArrowDownRounded } from '@mui/icons-material';
import { IShippingForm } from '@/interfaces/shipping';
import { shippingDefaultValues } from '@/data/shippingDefaultValues';
import { ShippingFormSchema } from '@/form-schemas/shippingFormSchema';
import requestService from '@/services/request.service';
import {
  buyersDictionary,
  fetchData,
  inspectionDictionary,
  sellersDictionary,
  sortCountries
} from '../../utils/common';
import { CustomPhoneInput } from './atoms/PhoneInput';
import showNotification from './atoms/Notification';
import { appState } from '@/store';
import { useSelector } from 'react-redux';
import {
  setShippingValues,
  setUserRequestData
} from '@/store/requests/reducer';
import { useAppDispatch } from '@/hooks/redux';
import { ErrorMessage } from './atoms/ErrorMessage';
import { useTranslation } from 'react-i18next';

interface Props {
  onSubmit: (values: any) => void;
  nextStep: () => void;
  handleBack: () => void;
}

const ExpeditionForm: FC<Props> = ({ nextStep, handleBack }) => {
  /*
   * hooks
   */
  const dispatch = useAppDispatch();
  const requestData = useSelector(({ requests }: appState) => requests);
  const [sellers, setSellers] = useState<any[]>([]);
  const [buyers, setBuyers] = useState<any[]>([]);
  const [inspectionPlaces, setInspectionPlace] = useState<any[]>([]);
  const [certificatesMethods, setCertificatesMethods] = useState<any[]>([]);
  const [certificatesIncoterms, setCertificatesIncoterms] = useState<any[]>([]);
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const {
    getValues: shippingFormValues,
    setValue,
    watch: shippingWatch,
    control: shippingControl,
    handleSubmit: handleShippingSubmit,
    formState: { errors: shippingErrors }
  } = useForm<IShippingForm>({
    defaultValues: requestData?.shippingValues ?? shippingDefaultValues,
    // @ts-ignore
    resolver: yupResolver(ShippingFormSchema)
  });

  const postExpeditions = async () => {
    const formValues = shippingFormValues();

    const payload = {
      inspection_date: formValues?.inspectionDate,
      seller_id:
        formValues?.sellerUuid == 'new' ? undefined : formValues?.sellerUuid,
      seller: {
        name: formValues?.companyName,
        email: formValues?.companyEmail,
        phone: formValues?.companyPhone.replace(/[^\d+]/g, ''),
        // phone: '+573222477789',
        address: formValues?.companyCompleteAddress,
        postal_code: formValues?.companyPostalCode,
        city: formValues?.companyCity,
        country: formValues?.companyCountry
      },
      buyer_id:
        formValues?.buyerUuid == 'new' ? undefined : formValues?.buyerUuid,
      buyer: {
        name: formValues?.buyerCompanyName,
        email: formValues?.buyerEmail,
        phone: formValues?.buyerPhone.replace(/[^\d+]/g, ''),
        // phone: '+573222477789',
        address: formValues?.buyerCompleteAddress,
        postal_code: formValues?.buyerPostalCode,
        city: formValues?.buyerCity,
        country: formValues?.buyerCountry
      },
      inspection_place_id:
        formValues?.inspectionUuid == 'new'
          ? undefined
          : formValues?.inspectionUuid,
      inspection_place: {
        name: formValues?.inspectionName,
        email: formValues?.inspectionEmail,
        phone: formValues?.inspectionPhone.replace(/[^\d+]/g, ''),
        // phone: '+573222477789',
        address: formValues?.inspectionCompleteAddress,
        postal_code: formValues?.inspectionPostalCode,
        city: formValues?.inspectionCity,
        country: formValues?.inspectionCountry,
        contact_name: formValues?.inspectorFirstName,
        contact_lastname: formValues?.inspectorLastName
      },
      expedition_method: formValues?.shippingMethod,
      expedition_incoterm: formValues?.shippingIncoterm
    };

    try {
      const { data, status } = await requestService.putShipping(
        payload,
        requestData?.userData?.id
      );
      if (status === 200 || status === 201) {
        showNotification({
          type: 'success',
          message: t('shipped_success'),
          timeout: 2000
        });
        dispatch(
          setUserRequestData({
            ...data,
            amount: requestData?.userData?.amount,
            codes: requestData?.userData?.codes
          })
        );
        nextStep();
      }
    } catch (e) {
      console.log(e);

      showNotification({
        type: 'error',
        message: (e?.response?.data?.errors ?? []).map((error: any) => {
          return error;
        }),

        timeout: 2000
      });
    }
  };

  const sellerWatcher = shippingWatch('sellerUuid');
  const buyerWatcher = shippingWatch('buyerUuid');
  const inspectionWatcher = shippingWatch('inspectionUuid');

  useEffect(() => {
    if (sellerWatcher == '') return;

    if (sellerWatcher !== 'new') {
      fetchData(
        requestService.getSeller,
        fillData,
        'Seller',
        sellerWatcher,
        sellersDictionary
      );
    } else {
      fillData(
        {
          name: requestData?.shippingValues?.companyName ?? '',
          email: requestData?.shippingValues?.companyEmail ?? '',
          phone: requestData?.shippingValues?.companyPhone ?? '',
          address: requestData?.shippingValues?.companyCompleteAddress ?? '',
          postal_code: requestData?.shippingValues?.companyPostalCode ?? '',
          city: requestData?.shippingValues?.companyCity ?? '',
          country: requestData?.shippingValues?.companyCountry ?? ''
        },
        sellersDictionary
      );
    }
    storeFormChanges();
  }, [sellerWatcher]);

  useEffect(() => {
    if (buyerWatcher == '') return;

    if (buyerWatcher !== 'new') {
      fetchData(
        requestService.getBuyer,
        fillData,
        'Buyer',
        buyerWatcher,
        buyersDictionary
      );
    } else {
      fillData(
        {
          name: requestData?.shippingValues?.buyerCompanyName ?? '',
          email: requestData?.shippingValues?.buyerEmail ?? '',
          phone: requestData?.shippingValues?.buyerPhone ?? '',
          address: requestData?.shippingValues?.buyerCompleteAddress ?? '',
          postal_code: requestData?.shippingValues?.buyerPostalCode ?? '',
          city: requestData?.shippingValues?.buyerCity ?? '',
          country: requestData?.shippingValues?.buyerCountry ?? ''
        },
        buyersDictionary
      );
    }
    storeFormChanges();
  }, [buyerWatcher]);

  useEffect(() => {
    if (inspectionWatcher == '') return;

    if (inspectionWatcher !== 'new') {
      fetchData(
        requestService.getInspectionPlace,
        fillData,
        'Inspection',
        inspectionWatcher,
        inspectionDictionary
      );
    } else {
      fillData(
        {
          name: requestData?.shippingValues?.inspectionName ?? '',
          email: requestData?.shippingValues?.inspectionEmail ?? '',
          phone: requestData?.shippingValues?.inspectionPhone ?? '',
          address: requestData?.shippingValues?.inspectionCompleteAddress ?? '',
          postal_code: requestData?.shippingValues?.inspectionPostalCode ?? '',
          city: requestData?.shippingValues?.inspectionCity ?? '',
          country: requestData?.shippingValues?.inspectionCountry ?? '',
          contact_name: requestData?.shippingValues?.inspectorFirstName ?? '',
          contact_lastname:
            requestData?.shippingValues?.inspectorLastName ?? '',
          inspection_date: ''
        },
        inspectionDictionary
      );
    }
    storeFormChanges();
  }, [inspectionWatcher]);

  useEffect(() => {
    fetchData(requestService.getSellers, setSellers, 'Sellers', null, null);
    fetchData(requestService.getBuyers, setBuyers, 'Buyers', null, null);
    fetchData(
      requestService.getInspectionPlaces,
      setInspectionPlace,
      'Inpection place',
      null,
      null
    );
  }, []);

  useEffect(() => {
    fetchData(
      requestService.getCertificadesMethods,
      setCertificatesMethods,
      'Certificates Methods',
      null,
      null
    );
    fetchData(
      requestService.getCertificadesIncoterms,
      setCertificatesIncoterms,
      'Certificates Incoterms',
      null,
      null
    );
  }, [i18n.language]);

  const fillData = (values, dictionary) => {
    const mappedData = {};

    Object?.keys(values).forEach((key) => {
      if (dictionary[key]) {
        setValue(dictionary[key], values[key]);
      }
    });
    storeFormChanges();
    return mappedData;
  };

  useEffect(() => {
    if (requestData?.userData?.id) {
      requestData?.userData?.seller &&
        fillData(requestData?.userData?.seller, sellersDictionary);

      requestData?.userData?.seller &&
        fillData(requestData?.userData?.buyer, buyersDictionary);
      requestData?.userData?.inspection_place &&
        fillData(requestData?.userData?.inspection_place, inspectionDictionary);
      setValue('shippingMethod', requestData?.userData?.expedition_method);
      setValue('shippingIncoterm', requestData?.userData?.expedition_incoterm);
      setValue(
        'inspectionDate',
        formatDate(requestData?.userData?.inspection_date)
      );
    } else {
      setValue(
        'shippingMethod',
        requestData?.shippingValues?.expedition_method ?? ''
      );
      setValue(
        'shippingIncoterm',
        requestData?.shippingValues?.expedition_incoterm ?? ''
      );
      setValue(
        'inspectionDate',
        requestData?.shippingValues?.inspection_date ?? ''
      );
    }
  }, [requestData?.userData]);

  const storeFormChanges = () => {
    dispatch(setShippingValues(shippingFormValues()));
  };

  useEffect(() => {
    if (Object.keys(shippingErrors).length > 0) {
      showNotification({
        type: 'error',
        message: t('check_signaled_fields'),
        timeout: 5000
      });
    }
  }, [shippingErrors]);

  const formatDate = (date) => {
    if (date?.includes('T')) {
      return date.split('T')?.[0] ?? '';
    } else {
      return date;
    }
  };

  return (
    <Box sx={{ width: '80%', margin: '2rem auto', paddingBottom: '6rem' }}>
      {loading ? (
        <Box display={'flex'} justifyContent={'center'} paddingTop={'35vh'}>
          <CircularProgress />
        </Box>
      ) : (
        <form
          onSubmit={handleShippingSubmit(postExpeditions)}
          onChange={storeFormChanges}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ display: 'flex' }}>
              <Typography variant={'h5'} sx={{ my: '.5rem' }}>
                {t('seller_data')}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ mb: '.5rem' }}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {t('add_or_select_seller')}
                </Typography>
                <Controller
                  name={'sellerUuid'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <FormControl fullWidth>
                      <Select
                        value={value}
                        id={'sellerUuid'}
                        onChange={onChange}
                        sx={{ width: '100%' }}
                        variant={'outlined'}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          {t('choose')}
                        </MenuItem>
                        <MenuItem value={'new'}>{t('new')}</MenuItem>

                        {(sellers ?? []).map((seller) => (
                          <MenuItem key={seller.id} value={seller.id}>
                            {seller.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('company_name')} *`}
                </Typography>
                <Controller
                  name={'companyName'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder={t('company_name')}
                      variant={'outlined'}
                      fullWidth
                      disabled={sellerWatcher == ''}
                      value={value}
                      onChange={onChange}
                      error={!!shippingErrors.companyName}
                      helperText={t(shippingErrors.companyName?.message, {
                        field: t('company_name')
                      })}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('country')} *`}
                </Typography>
                <Controller
                  name={'companyCountry'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={value}
                      onChange={(e) => {
                        onChange(e);
                        storeFormChanges();
                      }}
                      placeholder={t('country')}
                      disabled={sellerWatcher == ''}
                      error={!!shippingErrors.companyCountry}
                      labelId="demo-simple-select-outlined-label"
                      IconComponent={() => <KeyboardArrowDownRounded />}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        {t('choose')}
                      </MenuItem>
                      {sortCountries(i18n?.language).map((country) => (
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
              {!!shippingErrors.companyCountry && (
                <ErrorMessage
                  content={t(shippingErrors.companyCountry?.message ?? '', {
                    field: t('country')
                  })}
                />
              )}
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('email')} *`}
                </Typography>
                <Controller
                  name={'companyEmail'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder={'example@email.com'}
                      variant={'outlined'}
                      fullWidth
                      disabled={sellerWatcher == ''}
                      value={value}
                      onChange={onChange}
                      error={!!shippingErrors.companyEmail}
                      helperText={t(shippingErrors.companyEmail?.message, {
                        field: t('email')
                      })}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={5.6}>
              <CustomPhoneInput
                name="companyPhone"
                control={shippingControl}
                label={`${t('phone')} *`}
                disabled={sellerWatcher == ''}
                error={!!shippingErrors.companyPhone}
                labelForError="phone"
                helperText={shippingErrors.companyPhone?.message}
                onChange={(_value, _data, _event, formattedValue) => {
                  setValue('companyPhone', formattedValue);
                }}
                inputRef={undefined}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('full_address')} *`}
                </Typography>
                <Controller
                  name={'companyCompleteAddress'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder={t('example_address')}
                      variant={'outlined'}
                      fullWidth
                      value={value}
                      disabled={sellerWatcher == ''}
                      onChange={onChange}
                      error={!!shippingErrors.companyCompleteAddress}
                      helperText={t(
                        shippingErrors.companyCompleteAddress?.message,
                        {
                          field: t('full_address')
                        }
                      )}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('postal_code')} *`}
                </Typography>
                <Controller
                  name={'companyPostalCode'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder={'7500'}
                      variant={'outlined'}
                      fullWidth
                      value={value}
                      disabled={sellerWatcher == ''}
                      onChange={onChange}
                      error={!!shippingErrors.companyPostalCode}
                      helperText={t(shippingErrors.companyPostalCode?.message, {
                        field: t('postal_code')
                      })}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('city')} *`}
                </Typography>
                <Controller
                  name={'companyCity'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder={'Paris'}
                      variant={'outlined'}
                      fullWidth
                      disabled={sellerWatcher == ''}
                      value={value}
                      onChange={onChange}
                      error={!!shippingErrors.companyCity}
                      helperText={t(
                        shippingErrors.companyCompleteAddress?.message,
                        {
                          field: t('city')
                        }
                      )}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex' }}>
              <Typography variant={'h5'} sx={{ my: '.5rem' }}>
                {`${t('buyer_data')} *`}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ mb: '.5rem' }}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('add_or_select_buyer')}`}
                </Typography>
                <Controller
                  name={'buyerUuid'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <FormControl fullWidth>
                      <Select
                        value={value}
                        id={'buyerUuid'}
                        onChange={onChange}
                        sx={{ width: '100%' }}
                        variant={'outlined'}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          {t('choose')}
                        </MenuItem>
                        <MenuItem value={'new'}>{t('new')}</MenuItem>

                        {(buyers ?? []).map((buyer) => (
                          <MenuItem key={buyer.id} value={buyer.id}>
                            {buyer.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('company_name')} *`}
                </Typography>
                <Controller
                  name={'buyerCompanyName'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder={t('company_name')}
                      variant={'outlined'}
                      fullWidth
                      disabled={buyerWatcher == ''}
                      value={value}
                      onChange={onChange}
                      error={!!shippingErrors.buyerCompanyName}
                      helperText={t(shippingErrors.buyerCompanyName?.message, {
                        field: t('company_name')
                      })}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('country')} *`}
                </Typography>
                <Controller
                  name={'buyerCountry'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={value}
                      onChange={(e) => {
                        onChange(e);
                        storeFormChanges();
                      }}
                      placeholder={t('country')}
                      disabled={buyerWatcher == ''}
                      error={!!shippingErrors.buyerCountry}
                      labelId="demo-simple-select-outlined-label"
                      displayEmpty
                      IconComponent={() => <KeyboardArrowDownRounded />}
                    >
                      <MenuItem value="" disabled>
                        {t('choose')}
                      </MenuItem>
                      {sortCountries(i18n?.language).map((country) => (
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
              {!!shippingErrors.companyCountry && (
                <ErrorMessage
                  content={t(shippingErrors.buyerCountry?.message ?? '', {
                    field: t('country')
                  })}
                />
              )}
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('email')} *`}
                </Typography>
                <Controller
                  name={'buyerEmail'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder={'example@email.com'}
                      variant={'outlined'}
                      fullWidth
                      disabled={buyerWatcher == ''}
                      value={value}
                      onChange={onChange}
                      error={!!shippingErrors.buyerEmail}
                      helperText={t(shippingErrors.buyerEmail?.message, {
                        field: t('email')
                      })}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={5.6}>
              <CustomPhoneInput
                name="buyerPhone"
                control={shippingControl}
                label={`${t('phone')} *`}
                disabled={buyerWatcher == ''}
                error={!!shippingErrors.buyerPhone}
                helperText={shippingErrors.buyerPhone?.message}
                labelForError="phone"
                inputRef={undefined}
                onChange={(_value, _data, _event, formattedValue) => {
                  setValue('buyerPhone', formattedValue);
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('full_address')} *`}
                </Typography>
                <Controller
                  name={'buyerCompleteAddress'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder={t('example_address')}
                      variant={'outlined'}
                      fullWidth
                      disabled={buyerWatcher == ''}
                      value={value}
                      onChange={onChange}
                      error={!!shippingErrors.buyerCompleteAddress}
                      helperText={t(
                        shippingErrors.buyerCompleteAddress?.message,
                        {
                          field: t('full_address')
                        }
                      )}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('postal_code')} *`}
                </Typography>
                <Controller
                  name={'buyerPostalCode'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder={'7500'}
                      variant={'outlined'}
                      fullWidth
                      disabled={buyerWatcher == ''}
                      value={value}
                      onChange={onChange}
                      error={!!shippingErrors.buyerPostalCode}
                      helperText={t(shippingErrors.buyerPostalCode?.message, {
                        field: t('postal_code')
                      })}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('city')} *`}
                </Typography>
                <Controller
                  name={'buyerCity'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder={'Paris'}
                      variant={'outlined'}
                      fullWidth
                      value={value}
                      disabled={buyerWatcher == ''}
                      onChange={onChange}
                      error={!!shippingErrors.buyerCity}
                      helperText={t(shippingErrors.buyerCity?.message, {
                        field: t('city')
                      })}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', mt: '1rem' }}>
              <Typography variant={'h5'} sx={{ my: '.5rem' }}>
                {`${t('inspection_location')} *`}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ mb: '.5rem' }}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('add_or_select_inspection')} *`}
                </Typography>
                <Controller
                  name={'inspectionUuid'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <FormControl fullWidth>
                      <Select
                        value={value}
                        id={'inspectorUUIID'}
                        onChange={onChange}
                        sx={{ width: '100%' }}
                        variant={'outlined'}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          {t('choose')}
                        </MenuItem>
                        <MenuItem value={'new'}>{t('new')}</MenuItem>

                        {(inspectionPlaces ?? []).map((inspectionPlace) => (
                          <MenuItem
                            key={inspectionPlace.id}
                            value={inspectionPlace.id}
                          >
                            {inspectionPlace.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ width: '30%' }}>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('date_the_goods')} *`}
                </Typography>

                <Controller
                  name={'inspectionDate'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      label={`${t('expiration_date')} *`}
                      variant={'outlined'}
                      type={'date'}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={value}
                      disabled={inspectionWatcher == ''}
                      onChange={onChange}
                      error={!!shippingErrors.inspectionDate}
                      helperText={t(shippingErrors.inspectionDate?.message, {
                        field: t('expiration_date')
                      })}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('company_name')} *`}
                </Typography>
                <Controller
                  name={'inspectionName'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder={t('company_name')}
                      variant={'outlined'}
                      fullWidth
                      disabled={inspectionWatcher == ''}
                      value={value}
                      onChange={onChange}
                      error={!!shippingErrors.inspectionName}
                      helperText={t(shippingErrors.inspectionName?.message, {
                        field: t('company_name')
                      })}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('country')} *`}
                </Typography>
                <Controller
                  name={'inspectionCountry'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={value}
                      onChange={(e) => {
                        onChange(e);
                        storeFormChanges();
                      }}
                      disabled={inspectionWatcher == ''}
                      placeholder="Pays"
                      error={!!shippingErrors.inspectionCountry}
                      labelId="demo-simple-select-outlined-label"
                      displayEmpty
                      IconComponent={() => <KeyboardArrowDownRounded />}
                    >
                      <MenuItem value="" disabled>
                        {`${t('country')} *`}
                      </MenuItem>
                      {sortCountries(i18n?.language).map((country) => (
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
              {!!shippingErrors.inspectionCountry && (
                <ErrorMessage
                  content={t(shippingErrors.inspectionCountry?.message ?? '', {
                    field: t('country')
                  })}
                />
              )}
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('email')} *`}
                </Typography>
                <Controller
                  name={'inspectionEmail'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder={'example@email.com'}
                      variant={'outlined'}
                      fullWidth
                      value={value}
                      disabled={inspectionWatcher == ''}
                      onChange={onChange}
                      error={!!shippingErrors.inspectionEmail}
                      helperText={t(shippingErrors.inspectionEmail?.message, {
                        field: t('email')
                      })}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={5.6}>
              <CustomPhoneInput
                name="inspectionPhone"
                control={shippingControl}
                label={`${t('phone')} *`}
                disabled={inspectionWatcher == ''}
                error={!!shippingErrors.inspectionPhone}
                helperText={shippingErrors.inspectionPhone?.message}
                inputRef={undefined}
                labelForError="phone"
                onChange={(_value, _data, _event, formattedValue) => {
                  setValue('inspectionPhone', formattedValue);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('full_address')} *`}
                </Typography>
                <Controller
                  name={'inspectionCompleteAddress'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder={'90 chaussée de rouvroy'}
                      variant={'outlined'}
                      disabled={inspectionWatcher == ''}
                      fullWidth
                      value={value}
                      onChange={onChange}
                      error={!!shippingErrors.inspectionCompleteAddress}
                      helperText={t(
                        shippingErrors.inspectionCompleteAddress?.message,
                        {
                          field: t('full_address')
                        }
                      )}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('postal_code')} *`}
                </Typography>
                <Controller
                  name={'inspectionPostalCode'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder={'7500'}
                      variant={'outlined'}
                      fullWidth
                      disabled={inspectionWatcher == ''}
                      value={value}
                      onChange={onChange}
                      error={!!shippingErrors.inspectionPostalCode}
                      helperText={t(
                        shippingErrors.inspectionPostalCode?.message,
                        {
                          field: t('postal_code')
                        }
                      )}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('city')} *`}
                </Typography>
                <Controller
                  name={'inspectionCity'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder={'Paris'}
                      variant={'outlined'}
                      fullWidth
                      value={value}
                      disabled={inspectionWatcher == ''}
                      onChange={onChange}
                      error={!!shippingErrors.inspectionCity}
                      helperText={t(shippingErrors.inspectionCity?.message, {
                        field: t('city')
                      })}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('contact_name')} *`}
                </Typography>
                <Controller
                  name={'inspectorFirstName'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder={t('last_name')}
                      variant={'outlined'}
                      fullWidth
                      value={value}
                      disabled={inspectionWatcher == ''}
                      onChange={onChange}
                      error={!!shippingErrors.inspectorFirstName}
                      helperText={t(
                        shippingErrors.inspectorFirstName?.message,
                        {
                          field: t('contact_name')
                        }
                      )}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('contact_first_name')} *`}
                </Typography>
                <Controller
                  name={'inspectorLastName'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder={t('first_name')}
                      variant={'outlined'}
                      fullWidth
                      disabled={inspectionWatcher == ''}
                      value={value}
                      onChange={onChange}
                      error={!!shippingErrors.inspectorLastName}
                      helperText={t(shippingErrors.inspectorLastName?.message, {
                        field: t('contact_first_name')
                      })}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', mt: '1rem' }}>
              <Typography variant={'h5'} sx={{ my: '.5rem' }}>
                {`${t('shipping_method')} `}
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ mb: '.5rem' }}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('method')} *`}
                </Typography>
                <Controller
                  name={'shippingMethod'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <FormControl fullWidth>
                        <Select
                          value={value}
                          id={'method'}
                          onChange={(e) => {
                            onChange(e);
                            storeFormChanges();
                          }}
                          sx={{ width: '100%' }}
                          variant={'outlined'}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            {t('choose')}
                          </MenuItem>
                          {(certificatesMethods ?? []).map((method) => (
                            <MenuItem key={method.id} value={method.id}>
                              {t(method.id)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {!!shippingErrors.shippingMethod && (
                        <ErrorMessage
                          content={t(
                            shippingErrors.shippingMethod?.message ?? '',
                            {
                              field: t('method')
                            }
                          )}
                        ></ErrorMessage>
                      )}
                    </>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6} sx={{ mb: '.5rem' }}>
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                  {`${t('incoterm')} *`}
                </Typography>
                <Controller
                  name={'shippingIncoterm'}
                  control={shippingControl}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <FormControl fullWidth>
                        <Select
                          value={value}
                          id={'incoterms'}
                          onChange={(e) => {
                            onChange(e);
                            storeFormChanges();
                          }}
                          sx={{ width: '100%' }}
                          variant={'outlined'}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            {t('choose')}
                          </MenuItem>
                          {(certificatesIncoterms ?? []).map((incoTerms) => (
                            <MenuItem key={incoTerms} value={incoTerms}>
                              {t(incoTerms)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {!!shippingErrors.shippingIncoterm && (
                        <ErrorMessage
                          content={t(
                            shippingErrors.shippingIncoterm?.message ?? '',
                            {
                              field: t('incoterms')
                            }
                          )}
                        />
                      )}
                    </>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              marginTop={'3rem'}
              display={'flex'}
              sx={{ justifyContent: 'space-between' }}
            >
              <Button
                variant={'outlined'}
                onClick={handleBack}
                sx={{
                  textTransform: 'none',
                  color: 'text.secondary',
                  borderColor: 'text.disabled'
                }}
              >
                {t('previous_step')}
              </Button>
              <Button
                type="submit"
                variant={'contained'}
                sx={{ textTransform: 'none' }}
              >
                {t('next_step')}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Box>
  );
};

export default ExpeditionForm;
