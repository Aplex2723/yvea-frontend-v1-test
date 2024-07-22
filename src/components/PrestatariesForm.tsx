import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  styled,
  TextField,
  Typography
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProvidersFormSchema } from '@/form-schemas/providersFormSchema';
import { IProvider, IProvidersForm } from '@/interfaces/providers';
import { providersFormDefaultValues } from '@/data/providersFormDefaultValues';
import { HelpOutlineOutlined, HighlightOff } from '@mui/icons-material';
import { EmptyModal } from '@/components/EmptyModal';
import Link from 'next/link';
import requestService from '@/services/request.service';
import { useSelector } from 'react-redux';
import { appState } from '@/store';
import showNotification from './atoms/Notification';
import { useAppDispatch } from '@/hooks/redux';
import { setUserRequestData } from '@/store/requests/reducer';
import { fillData, providerDictionary } from '../../utils/common';
import { useTranslation } from 'react-i18next';
interface Props {
  onSubmit: (values: any) => void;
  nextStep: () => void;
  handleBack: () => void;
}

const AnnualBox = styled(Box)({
  height: '23rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

const PrestatariesForm: FC<Props> = ({ handleBack, nextStep }) => {
  /*
   * hooks
   */
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const requestData = useSelector(({ requests }: appState) => requests);
  const [annualRegister, setAnnualRegister] = useState<boolean>(false);
  const [showFields, setShowFields] = useState<any>(false);
  const [showBenefits, setShowBenefits] = useState<any>(false);
  const {
    getValues,

    setValue,
    control: providersControl,
    handleSubmit: handleProvidersSubmit,
    formState: { errors: providersErrors }
  } = useForm<IProvidersForm>({
    defaultValues: providersFormDefaultValues,
    // @ts-ignore
    resolver: yupResolver(ProvidersFormSchema)
  });

  const handleCloseAnnualRegister = () => {
    setAnnualRegister(false);
  };

  const postPrestataries = async () => {
    const formValues = getValues();

    const payload: IProvider = {
      custom_authority: {
        name: formValues?.organizationName
          ? formValues?.organizationName
          : null,
        contact: formValues?.contactName ? formValues?.contactName : null,
        email: formValues?.email ? formValues?.email : null,
        has_annual_reg_route_bc: formValues?.benefitsCheck,
        reference: formValues?.reference ? formValues?.reference : null,
        expiration_date: formValues.expirationDate
          ? formValues.expirationDate
          : null
      }
    };

    try {
      const { data, status } = await requestService.putPrestataries(
        payload,
        requestData?.userData?.id
      );
      if (status === 200 || status === 201) {
        showNotification({
          type: 'success',
          message: t('providers_success'),
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
    }
  };

  const checkedProvider = (field: any, value: string) => {
    field.onChange(value);

    setValue('yveaProvider', value);
    setValue('contactName', '');
    setValue('organizationName', '');
    setValue('email', '');
    setShowFields(value);
  };

  useEffect(() => {
    if (requestData?.userData?.id) {
      const formValues = requestData?.userData?.custom_authority;
      const isFullForm = formValues?.contact;

      const fullForm = {
        contact: isFullForm ? formValues?.contact : undefined,
        name: isFullForm ? formValues?.name : undefined,
        email: isFullForm ? formValues?.email : undefined,
        has_annual_reg_route_bc: formValues?.has_annual_reg_route_bc
          ? true
          : false,
        reference: formValues?.has_annual_reg_route_bc
          ? formValues?.reference
          : undefined,
        expiration_date: formValues?.has_annual_reg_route_bc
          ? formValues?.expiration_date
          : undefined
      };

      fillData(fullForm, providerDictionary, setValue);
      setValue('yveaProvider', isFullForm ? 'false' : 'true');
      setShowFields(isFullForm ? 'false' : 'true');
      setShowBenefits(formValues?.has_annual_reg_route_bc);
    }
  }, [requestData?.userData]);

  const checkBennefits = (field: any, value) => {
    field.onChange(value);
    setAnnualRegister(value);
    setShowBenefits(value);
    setValue('reference', '');
    setValue('expirationDate', '');
  };

  useEffect(() => {
    console.log(providersErrors);
  }, [providersErrors])
  

  return (
    <Box sx={{ width: '80%', margin: '2rem auto', paddingBottom: '6rem' }}>
      {/*annual register*/}
      <EmptyModal
        isOpen={annualRegister}
        onClose={() => handleCloseAnnualRegister()}
      >
        <AnnualBox>
          <Box sx={{ width: '100%', paddingX: '3rem' }}>
            <Typography
              variant={'body2'}
              sx={{ textAlign: 'center', fontSize: '18px', mt: '2rem' }}
            >
              {t('annual_resgistration_is_an_option')}
              <br />
              <br />
              {t('to_benefit_from_this_option')}
              <br />
              <br />
              {t('for_more_information')}
              <Link href={'https://yvea.io/pvoc/'} target={'_blank'}>
                <strong style={{ textDecoration: 'underline' }}>
                  {t('clicks_here')}
                </strong>
              </Link>
            </Typography>
          </Box>
          <Box
            sx={{ cursor: 'pointer' }}
            onClick={() => handleCloseAnnualRegister()}
          >
            <HighlightOff
              sx={{
                color: 'error.main',
                margin: '2rem auto',
                fontSize: '30px'
              }}
            />
          </Box>
        </AnnualBox>
      </EmptyModal>
      <form onSubmit={handleProvidersSubmit(postPrestataries)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: 'flex' }}>
            <Typography variant={'body2'} sx={{ mt: '1rem', fontSize: '18px' }}>
              {t('select_option_regarding')}
            </Typography>
            <Typography
              variant={'body2'}
              sx={{ color: 'error.main', ml: '1rem' }}
            ></Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name={'yveaProvider'}
                control={providersControl}
                render={({ field }) => (
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onChange={(_event, value) =>
                        checkedProvider(field, value)
                      }
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="female"
                      name="radio-buttons-group"
                    >
                      <FormControlLabel
                        value={true}
                        control={<Radio />}
                        label={t('let_decide')}
                      />
                      <FormControlLabel
                        value={false}
                        control={<Radio />}
                        label={t('i_need_use_service')}
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </FormControl>
          </Grid>
          {showFields == 'false' && (
            <>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Controller
                    name={'organizationName'}
                    control={providersControl}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        label={`${t('organization_name')} *`}
                        variant={'outlined'}
                        fullWidth
                        value={value}
                        onChange={onChange}
                        error={!!providersErrors.organizationName}
                        helperText={t(
                          providersErrors.organizationName?.message,
                          {
                            field: t('organization_name')
                          }
                        )}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Controller
                    name={'contactName'}
                    control={providersControl}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        label={t('contact_name_optional')}
                        variant={'outlined'}
                        fullWidth
                        value={value}
                        onChange={onChange}
                        error={!!providersErrors.contactName}
                        helperText={providersErrors.contactName?.message}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6} sx={{ mt: '1rem' }}>
                <FormControl fullWidth>
                  <Controller
                    name={'email'}
                    control={providersControl}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        label={`${t('email')}*`}
                        variant={'outlined'}
                        fullWidth
                        value={value}
                        onChange={onChange}
                        error={!!providersErrors.email}
                        helperText={t(
                          providersErrors.email?.message,
                          {
                            field: t('email')
                          }
                        )}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </>
          )}
          <Grid item xs={12} sx={{ mt: '1rem' }}>
            <FormControl fullWidth>
              <Controller
                name={'benefitsCheck'}
                control={providersControl}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        color={'secondary'}
                        sx={{
                          color: 'secondary.50',
                          '&.Mui-checked': {
                            color: 'secondary.main'
                          }
                        }}
                        onChange={(_event, value) =>
                          checkBennefits(field, value)
                        }
                      />
                    }
                    label={
                      <Box display={'flex'}>
                        <Typography variant={'body2'} sx={{ fontSize: '16px' }}>
                          {t('i_benefict')}
                        </Typography>
                        <HelpOutlineOutlined
                          sx={{ color: 'text.secondary', height: '1rem' }}
                        />
                      </Box>
                    }
                  />
                )}
              />
            </FormControl>
          </Grid>
          {showBenefits && (
            <>
              <Grid item xs={12} sx={{ mt: '1rem' }}>
                <FormControl sx={{ width: '50%' }}>
                  <Controller
                    name={'reference'}
                    control={providersControl}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        label={`${t('reference')} *`}
                        variant={'outlined'}
                        fullWidth
                        value={value}
                        onChange={onChange}
                        error={!!providersErrors.reference}
                        helperText={t(providersErrors.reference?.message, {
                          field: t('reference')
                        })}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6} sx={{ mt: '1rem' }}>
                <FormControl sx={{ width: '50%' }}>
                  <Controller
                    name={'expirationDate'}
                    control={providersControl}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        label={`${t('expiration_date')} *`}
                        variant={'outlined'}
                        type={'date'}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={value}
                        onChange={onChange}
                        error={!!providersErrors.expirationDate}
                        helperText={t(providersErrors.expirationDate?.message, {
                          field: t('expiration_date')
                        })}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </>
          )}
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
    </Box>
  );
};

export default PrestatariesForm;
