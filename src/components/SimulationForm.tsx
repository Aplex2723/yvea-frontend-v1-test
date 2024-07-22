import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  debounce,
  Drawer,
  FormControl,
  Grid,
  MenuItem,
  Select,
  styled,
  TextField,
  Typography
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import {
  INomenclatureCode,
  ISimulation,
  ISimulationForm
} from '@/interfaces/simulation';
import { ICountry } from '@/interfaces/common';
import { yupResolver } from '@hookform/resolvers/yup';
import { SimulationFormSchema } from '@/form-schemas/simulationFormSchema';
import { simulationFormDefaultValues } from '@/data/simulationFormDefaultValues';
import {
  ContentPasteSearchOutlined,
  KeyboardArrowDownRounded,
  SearchOutlined
} from '@mui/icons-material';
import Link from 'next/link';
import SimulationTable from '@/components/SimulationTable';
import { EmptyModal } from '@/components/EmptyModal';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import CampaignIcon from '@mui/icons-material/Campaign';
import { AlertDot, RevenirButtom } from '@/components/atoms/styledComponents';
import requestService from '@/services/request.service';
import showNotification from '@/components/atoms/Notification';
import { otherDestinations } from '../../utils/common';
import { useAppDispatch } from '@hooks/redux';
import {
  setCertificatesQty,
  setSelectedProduct,
  setUserRequestData,
  setTotalCertificate,
  updateDraftState
} from '@/store/requests/reducer';
import { useSelector } from 'react-redux';
import { appState } from '@/store';
import { algeriaCost } from '@/helpers/calculator';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const PvocModalBox = styled(Box)({
  height: '24rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

const NoAutomatedBox = styled(Box)({
  height: '28rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

const MandatoryControlBox = styled(Box)({
  height: '20rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

const ChangecountryBox = styled(Box)({
  height: '20rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

interface Props {
  onSucceed: (editionId: number, firstStepForm: ISimulation) => void;
  countries: ICountry[];
  id?: number;
  // simulationData?: ISimulation;
}
const SimulationForm: FC<Props> = ({
  onSucceed,
  countries
  // id = null,
  // simulationData,
}) => {
  /*
   * hooks
   */
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { certificateId } = router.query;
  const { t, i18n } = useTranslation();

  const requestData = useSelector(({ requests }: appState) => requests);
  const [pvocModalShowed, setPvocModalShowed] = useState<boolean>(false);
  const [noAutomatedWarningShowed, setNoAutomatedWarningShowed] =
    useState<boolean>(false);
  const [mandatoryProductsControl, setMandatoryProductsControl] =
    useState<boolean>(false);
  const [changeCountryShowed, setChangeCountryShowed] =
    useState<boolean>(false);
  const [coefValues, setCoefValues] = useState<{
    min: number;
    max: number;
    coef: number;
    no_certification_cost: number;
  }>(null);
  const [blockSubmit, setBlockSubmit] = useState<boolean>(false);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [selectedCode, setSelectedCode] = useState<string>('');
  const [matchedCountry, setMatchedCountry] = useState<string>('');
  const [certificates, setCertificates] = useState<any>([]);

  const [searcher, setSetSearcher] = useState<string>('');
  const [codes, setCodes] = useState<Array<any>>([]);
  const [nomenclatureCodes, setNomenclatureCodes] = useState<
    Array<INomenclatureCode>
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const {
    control: simulationControl,
    handleSubmit: handleSimulationSubmit,
    watch: simulationWatch,
    formState: { errors: simulationErrors },
    setValue,
    getValues
  } = useForm<ISimulationForm>({
    defaultValues: simulationFormDefaultValues,
    // @ts-ignore
    resolver: yupResolver(SimulationFormSchema)
  });

  useEffect(() => {
    if (certificateId && certificates.length > 0) {
      return fillData(certificateId);
    }

    if (requestData?.userData?.id && !certificateId) {
      setNomenclatureCodes(requestData?.userData?.nomenclature_codes ?? []);
      setValue('country', requestData?.userData?.country);
      setValue('title', requestData?.userData?.title);
    }
  }, [requestData?.userData, certificateId, certificates.length]);

  useEffect(() => {
    if (!simulationWatch('country')) return;
    getCountryDetails(simulationWatch('country'));
  }, [simulationWatch('country')]);

  useEffect(() => {
    if (!nomenclatureCodes?.length) return;
    calculateCertificationCost(coefValues);
  }, [nomenclatureCodes]);

  const calculateCertificationCost = (coefValues_) => {
    const total = nomenclatureCodes.reduce((acc, item) => {
      return acc + item.amount;
    }, 0);

    switch (simulationWatch('country')) {
      case 'ALGERIA':
        setTotalCost(algeriaCost(total));
        break;
      default:
        if (!coefValues_ && !certificateId && total >= 0) {
          return null;
        }
        if (!coefValues_ && !certificateId && !total) {
          return setTotalCost(0);
        }

        if (!coefValues_ && certificateId) {
          return null;
        }

        regularCalculation(coefValues_, total);
        break;
    }
  };

  const regularCalculation = (coefValues_, total) => {
    if (
      coefValues_?.no_certification_cost &&
      total < coefValues_.no_certification_cost &&
      certificateId
    ) {
      return null;
    }
    if (
      coefValues_?.no_certification_cost &&
      total < coefValues_.no_certification_cost &&
      !certificateId &&
      !total
    ) {
      setTotalCost(0);
    }
    if (
      coefValues_?.no_certification_cost &&
      total < coefValues_.no_certification_cost &&
      !certificateId &&
      total >= 0
    ) {
      return null;
    }

    if (total >= coefValues_.no_certification_cost) {
      const cost = total * (coefValues_.coef / 100);
      if (cost < coefValues_?.min) {
        setTotalCost(coefValues_.min);
      }
      if (coefValues_?.max) {
        if (cost > coefValues_.min && cost < coefValues_.max) {
          setTotalCost(cost);
        }
        if (cost > coefValues_?.max) {
          setTotalCost(coefValues_?.max);
        }
      } else {
        setTotalCost(cost);
      }
    }
  };

  const getCountryDetails = async (id: string) => {
    try {
      const response = await requestService.getCountryDetails(id);
      if (response.status === 200) {
        if (!response?.data?.certificate_calculation_by_coefficient_with_max) {
          if (certificateId) return setCoefValues(null);
          if (!certificateId && totalCost > 0) return setCoefValues(null);

          setTotalCost(0);
          setCoefValues(null);
        } else {
          let coef = {
            min: response.data?.certificate_calculation_by_coefficient_with_max
              ?.min_border,
            max:
              response.data?.certificate_calculation_by_coefficient_with_max
                ?.max_border ?? null,
            coef: response.data?.certificate_calculation_by_coefficient_with_max
              ?.coefficient_percentage,
            no_certification_cost:
              response.data?.no_certification_required_below_threshold ?? 0
          };
          setCoefValues(coef);
          calculateCertificationCost(coef);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getCodes = async (code: string) => {
    try {
      if (!simulationWatch('country')) return;
      const codesRespose = await requestService.getCodes(
        simulationWatch('country'),
        code
      );
      const sortedData = codesRespose.data.sort((a, b) =>
        a.code.localeCompare(b.code)
      );
      setCodes(sortedData);
    } catch (e) {
      console.log(e);
    }
  };

  const getCertificates = async () => {
    try {
      const certificates = await requestService.getCertificates();
      setCertificates(certificates.data.data);

      dispatch(setCertificatesQty(certificates.data?.data?.length));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (searcher) {
      debounceOnChange(searcher);
    }
  }, [searcher]);

  useEffect(() => {
    getCertificates();
  }, []);

  const debounceOnChange = useMemo(() => debounce(getCodes, 500), []);

  const handleSelectCode = (value: any) => {
    setSelectedCode(value?.code ?? '');
  };

  const addCode = (code: string) => {
    setSelectedCode('');
    setSetSearcher('');

    const newCode: INomenclatureCode = {
      code: code,
      amount: 0,
      products: []
    };

    const isCodeAlreadyAdded = nomenclatureCodes.some(
      (existingCode) => existingCode.code === code
    );

    if (isCodeAlreadyAdded) {
      return showNotification({
        type: 'error',
        message: t('code_already_registered'),
        timeout: 2000
      });
    } else {
      setNomenclatureCodes([...nomenclatureCodes, newCode]);
    }
  };

  const handleOnClickPvoc = () => {
    setPvocModalShowed(false);
    setValue('country', 'ALGERIA');
  };

  const handleOnClickNoAutomated = () => {
    setNoAutomatedWarningShowed(false);
  };

  const handleOnClickMandatoryProductsControl = () => {
    setMandatoryProductsControl(false);
  };

  const postSimulation = async (values: ISimulationForm) => {
    try {
      const payload: ISimulation = {
        country: values.country,
        title: values.title,
        nomenclature_codes: nomenclatureCodes,
        totalCost: totalCost
      };

      if (certificateId) {
        await updateSimulation(payload, certificateId);
        return;
      }
      if (requestData.userData.id && requestData.draftCreated) {
        await updateSimulation(payload, requestData.userData.id);
        return;
      }
      const { data, status } = await requestService.postSimulation();
      if (status === 201) {
        dispatch(updateDraftState(true));
        showNotification({
          type: 'success',
          message: t('simulation_created'),
          timeout: 2000
        });
        if (requestData?.userData?.id) {
          const payloadBasedOnOldRequest = {
            ...requestData?.userData,
            ...payload
          };
          const id = getValues()?.name;
          if (id) {
            if (payloadBasedOnOldRequest.buyer)
              payloadBasedOnOldRequest.buyer_id =
                payloadBasedOnOldRequest.buyer.id;
            if (payloadBasedOnOldRequest.seller)
              payloadBasedOnOldRequest.seller_id =
                payloadBasedOnOldRequest.seller.id;
            if (payloadBasedOnOldRequest.inspector)
              payloadBasedOnOldRequest.inspector_id =
                payloadBasedOnOldRequest.inspector.id;
          }
          delete payloadBasedOnOldRequest['id'];
          delete payloadBasedOnOldRequest['created_at'];
          updateSimulation(payloadBasedOnOldRequest, data?.id);
        } else {
          updateSimulation(payload, data?.id);
        }
        onSucceed(data.id, payload);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const updateSimulation = async (payload: ISimulation, id) => {
    try {
      const { data, status } = await requestService.putSimulation(payload, id);
      if (status === 200 || status === 201) {
        showNotification({
          type: 'success',
          message: t('simulation_edited'),
          timeout: 2000
        });
        dispatch(
          setUserRequestData({
            ...data
          })
        );

        dispatch(setTotalCertificate(totalCost));
        onSucceed(data.id, payload);

        nomenclatureCodes.map((obj) => {
          const sortedProducts = obj.products
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name));
          return { ...obj, products: sortedProducts };
        });

        dispatch(setSelectedProduct([]));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const validateCountry = (value: string) => {
    const matchCountry = otherDestinations.includes(value);
    if (matchCountry) {
      setMatchedCountry(value);
      return setNoAutomatedWarningShowed(true);
    }
    if (value == 'ALGERIA') return setPvocModalShowed(true);
    if (
      requestData?.userData?.country &&
      value !== requestData?.userData?.country
    )
      return setChangeCountryShowed(true);

    setValue('country', value);
    setValue('title', '');

    setTotalCost(0);
    setBlockSubmit(matchCountry);
    return setNomenclatureCodes([]);
  };

  const handleRequestChange = (event) => {
    const id = event.target.value;
    setValue('name', id);
    if (id !== 'new') return fillData(id);
    if (id == 'new') {
      dispatch(setUserRequestData([]));
      setValue('country', '');
      setValue('title', '');

      setTotalCost(0);
      return setNomenclatureCodes([]);
    }
  };

  const fillData = (id: any) => {
    const result = certificates.find((item) => item.id == id);

    dispatch(setUserRequestData(result));
    setNomenclatureCodes(result?.nomenclature_codes);
    setValue('country', result?.country);
    setValue('title', result?.title);
    setTotalCost(result?.total_cost);

    dispatch(setTotalCertificate(result?.total_cost));
  };

  const eraseData = () => {
    setChangeCountryShowed(false);
    dispatch(setUserRequestData({ id: requestData?.userData?.id }));
  };

  const handleCancel = () => {
    if (router.pathname.startsWith('/dashboard/user')) {
      router.push('/dashboard/user');
    } else {
      router.push('/dashboard/admin');
    }
  };

  const sortedCountries = (_lang, countryList) => {
    countryList.sort((a, b) => a.name.localeCompare(b.name));
    return countryList;
  };

  return (
    <Box sx={{ width: '80%', margin: '2rem auto', paddingBottom: '6rem' }}>
      {/*pvoc modal*/}
      <EmptyModal
        isOpen={pvocModalShowed}
        onClose={() => {
          setPvocModalShowed(false);
        }}
      >
        <PvocModalBox>
          <AlertDot>
            <ReportGmailerrorredIcon
              sx={{ color: (theme) => theme.palette.error.main }}
            />
          </AlertDot>
          <Typography
            variant={'body2'}
            sx={{ textAlign: 'center', fontSize: '18px', mb: '2rem' }}
          >
            {t('you_select_destination_with_pvoc')}
          </Typography>
          <Typography
            variant={'body2'}
            sx={{ textAlign: 'center', fontSize: '18px', mb: '2rem' }}
          >
            {t('if_none_of_this')}
          </Typography>
          <Button
            variant={'contained'}
            onClick={() => handleOnClickPvoc()}
            sx={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
          >
            {t('continue_request')}
          </Button>
          <RevenirButtom
            variant={'text'}
            onClick={() => setPvocModalShowed(false)}
          >
            {t('return_to_dashboard')}
          </RevenirButtom>
        </PvocModalBox>
      </EmptyModal>
      {/*not automated modal*/}
      <EmptyModal
        isOpen={noAutomatedWarningShowed}
        onClose={() => setNoAutomatedWarningShowed(false)}
      >
        <NoAutomatedBox>
          <AlertDot>
            <ReportGmailerrorredIcon
              sx={{ color: (theme) => theme.palette.error.main }}
            />
          </AlertDot>
          <Box sx={{ width: '100%', paddingX: '3rem' }}>
            <Typography
              variant={'body2'}
              sx={{ textAlign: 'center', fontSize: '18px', mb: '2rem' }}
            >
              {t('this_destination_not_automated')}
            </Typography>
            <Typography
              variant={'body2'}
              sx={{ textAlign: 'center', fontSize: '16px', mb: '2rem' }}
            >
              {t('we_invite_to_send')}
              <strong> pvoc@yvea.io</strong>
            </Typography>
            <Typography
              variant={'body2'}
              sx={{
                textAlign: 'center',
                fontSize: '14px',
                mb: '2rem',
                color: 'error.main'
              }}
            >
              {t('specify_in_mail_subject')}
            </Typography>
          </Box>
          <Button
            variant={'contained'}
            onClick={() => handleOnClickNoAutomated()}
            sx={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
          >
            {t('modify_my_entrie')}
          </Button>
          <RevenirButtom
            variant={'text'}
            onClick={() => handleOnClickNoAutomated()}
          >
            {t('return_to_dashboar')}
          </RevenirButtom>
        </NoAutomatedBox>
      </EmptyModal>
      {/*mandatory products control*/}
      <EmptyModal
        isOpen={mandatoryProductsControl}
        onClose={() => {
          setMandatoryProductsControl(false);
          setMatchedCountry('');
        }}
      >
        <MandatoryControlBox>
          <AlertDot>
            <ContentPasteSearchOutlined
              sx={{ color: (theme) => theme.palette.success.main }}
            />
          </AlertDot>
          <Box sx={{ width: '100%', paddingX: '3rem' }}>
            <Typography
              variant={'body2'}
              sx={{ textAlign: 'center', fontSize: '18px', mb: '2rem' }}
            >
              {t('the_products_provided')}{' '}
              <strong>
                {`${t(matchedCountry)} ${t('are_subject_to_mandatory')})`}
              </strong>
            </Typography>
            <Typography
              variant={'body2'}
              sx={{ textAlign: 'center', fontSize: '16px', mb: '2rem' }}
            >
              {t('the_coast_certificate')}{' '}
              <strong>{totalCost?.toFixed(2) ?? 0}</strong>
              {t('withouth_taxes')}
            </Typography>
          </Box>
          <Button
            variant={'contained'}
            onClick={() => {
              handleOnClickMandatoryProductsControl();
              setMatchedCountry('');
            }}
            sx={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
          >
            {t('open_file_with_yvea')}
          </Button>
          <RevenirButtom
            variant={'text'}
            onClick={() => {
              handleOnClickMandatoryProductsControl();
              setMatchedCountry('');
            }}
          >
            {t('modify_my_entry')}
          </RevenirButtom>
        </MandatoryControlBox>
      </EmptyModal>

      <EmptyModal
        isOpen={changeCountryShowed}
        onClose={() => setChangeCountryShowed(false)}
      >
        <ChangecountryBox>
          <AlertDot>
            <CampaignIcon
              sx={{ color: (theme) => theme.palette.warning[700] }}
            />
          </AlertDot>
          <Box sx={{ width: '100%', paddingX: '3rem' }}>
            <Typography
              variant={'body2'}
              sx={{ textAlign: 'center', fontSize: '18px', mb: '2rem' }}
            >
              {t('attention')}
            </Typography>
            <Typography
              variant={'body2'}
              sx={{ textAlign: 'center', fontSize: '16px', mb: '2rem' }}
            >
              {t('by_changing_destination')}
            </Typography>
          </Box>
          <Button
            variant={'contained'}
            onClick={() => {
              eraseData();
            }}
            sx={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
          >
            {t('continue_my_request')}
          </Button>
          <RevenirButtom
            variant={'text'}
            onClick={() => setChangeCountryShowed(false)}
          >
            {t('modify_my_entrie')}
          </RevenirButtom>
        </ChangecountryBox>
      </EmptyModal>
      {loading ? (
        <Box display={'flex'} justifyContent={'center'} paddingTop={'35vh'}>
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleSimulationSubmit(postSimulation)}>
          <Grid container spacing={2}>
            {!certificateId &&
              (!requestData?.userData?.id ||
                (requestData?.userData?.id && !requestData?.draftCreated)) && (
                <Grid item xs={12}>
                  {/*this is going to be an autocompleter*/}
                  <Typography
                    variant={'body2'}
                    sx={{ fontSize: '15px', mb: '.5rem', pl: '.2rem' }}
                  >
                    {t('create_new_request')}
                  </Typography>
                  <FormControl fullWidth>
                    <Controller
                      name={'name'}
                      control={simulationControl}
                      render={({ field: { value } }) => (
                        <Select
                          value={value}
                          onChange={handleRequestChange}
                          placeholder={t('name')}
                          error={!!simulationErrors.name}
                          labelId="demo-simple-select-outlined-label"
                          displayEmpty
                          IconComponent={() => <KeyboardArrowDownRounded />}
                        >
                          <MenuItem value="" disabled>
                            {t('choose')}
                          </MenuItem>
                          {[
                            { id: 'new', title: t('new') },
                            ...certificates
                          ].map((certificate) => (
                            <MenuItem
                              key={certificate.id}
                              value={certificate.id}
                            >
                              {certificate?.title || ''}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
              )}
            <Grid item xs={12}>
              <Typography
                variant={'body2'}
                sx={{ fontSize: '15px', mb: '.5rem', pl: '.2rem' }}
              >
                {t('choose_your_destination')}
              </Typography>
              <FormControl fullWidth>
                <Controller
                  name={'country'}
                  control={simulationControl}
                  render={({ field: { value } }) => (
                    <Select
                      value={value}
                      onChange={(e: any) => {
                        validateCountry(e?.target?.value);
                      }}
                      placeholder="Vessel"
                      error={!!simulationErrors.country}
                      labelId="demo-simple-select-outlined-label"
                      displayEmpty
                      IconComponent={() => <KeyboardArrowDownRounded />}
                    >
                      <MenuItem value="" disabled>
                        {t('choose')}
                      </MenuItem>
                      {sortedCountries(i18n.language, countries).map(
                        (country) => (
                          <MenuItem key={country.id} value={country.id}>
                            {t(country.name)}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant={'body2'}
                sx={{ fontSize: '15px', mb: '.5rem', pl: '.2rem' }}
              >
                {t('request_title')}
              </Typography>
              <FormControl fullWidth>
                <Controller
                  name={'title'}
                  control={simulationControl}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      label={`${t('request_title')} *`}
                      value={value}
                      onChange={onChange}
                      placeholder={t('request_title')}
                      error={!!simulationErrors.title}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} marginTop={'2rem'}>
              <Grid container>
                <Typography
                  variant={'body2'}
                  sx={{ fontSize: '15px', mb: '.5rem', pl: '.2rem' }}
                >
                  {t('nomenclature_code_sh')}
                </Typography>
                <Typography
                  variant={'body2'}
                  width={'100%'}
                  color={'warning.800'}
                  sx={{ fontSize: '15px', mb: '.5rem', pl: '.2rem' }}
                >
                  {t('enter_first_digits')}
                </Typography>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Autocomplete
                      options={codes}
                      getOptionLabel={(code: any) => code.code}
                      onChange={(_, value) => handleSelectCode(value)}
                      noOptionsText={t('no_options')}
                      onInputChange={(_, newInputValue) => {
                        setSetSearcher(newInputValue);
                      }}
                      popupIcon={<SearchOutlined />}
                      sx={{
                        '& .MuiInputBase-root': {
                          height: '50px',
                          padding: '2px 10px'
                        }
                      }}
                      renderOption={(props, { code }) => (
                        <Box component="li" alignItems="flex-start" {...props}>
                          <Box display="flex" flexDirection="column">
                            <Typography variant="caption">{code}</Typography>
                          </Box>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField {...params} placeholder={t('6_figures')} />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3} sx={{ display: 'flex', alignItems: 'end' }}>
                  <Button
                    variant={'contained'}
                    onClick={() => {
                      addCode(selectedCode);
                    }}
                    disabled={!selectedCode}
                    sx={{
                      mb: '.2rem',
                      height: '3rem',
                      width: '8rem',
                      borderRadius: '8px',
                      ml: '1rem'
                    }}
                  >
                    {t('add')}
                  </Button>
                </Grid>
              </Grid>
              <Link href={'https://www.tarifdouanier.eu/'} target={'_blank'}>
                <Typography
                  sx={{
                    color: (theme) => theme.palette.primary.main,
                    textDecoration: 'underline',
                    ml: '.3rem',
                    mt: '.3rem',
                    fontSize: '14px'
                  }}
                >
                  {t('dont_know_product')}
                </Typography>
              </Link>
            </Grid>
            <Grid item xs={12} marginTop={'2rem'}>
              <SimulationTable
                nomenclatureCodes={nomenclatureCodes}
                setNomenclatureCodes={setNomenclatureCodes}
              />
            </Grid>
          </Grid>
          <Drawer
            anchor={'bottom'}
            variant={'persistent'}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: '100%',
                height: ' 8rem',
                boxShadow: '0px 0px 15px 0px #00000040',
                display: 'flex',
                zIndex: 1,
                flexDirection: 'row',
                justifyContent: 'end',
                border: (theme) => `1px solid ${theme.palette.primary.main}`
              }
            }}
            open={true}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'end',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <Button
                variant={'contained'}
                onClick={handleCancel}
                sx={{
                  mb: '3rem',
                  height: '2rem',
                  width: '16rem',
                  borderRadius: '8px',
                  ml: '1rem'
                }}
                type={'button'}
                /*disabled if any of the price units is zero*/
              >
                {t('cancel')}
              </Button>
              <Button
                variant={'contained'}
                sx={{
                  mb: '3rem',
                  height: '2rem',
                  width: '16rem',
                  borderRadius: '8px',
                  ml: '1rem'
                }}
                type={'submit'}
                /*disabled if any of the price units is zero*/
                disabled={
                  !nomenclatureCodes?.length ||
                  blockSubmit ||
                  nomenclatureCodes?.some(
                    (item) => item?.products?.length === 0
                  ) ||
                  nomenclatureCodes?.some((item) =>
                    item?.products?.some(
                      (product) =>
                        product.unit_price === 0 && !product.standalone
                    )
                  ) ||
                  totalCost == 0
                }
              >
                {t(
                  certificateId
                    ? 'edit_request'
                    : requestData.userData.id
                    ? 'next_step'
                    : 'create_request'
                )}
              </Button>
              <Box
                display={'flex'}
                width={'12rem'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'flex-end'}
                marginRight={'2rem'}
              >
                <Typography
                  variant={'body2'}
                  sx={{ fontSize: '15px', mb: '.5rem', pl: '.2rem' }}
                >
                  {t('certificate_cost')}
                </Typography>
                <Typography variant={'h4'} sx={{ fontWeight: 'bold' }}>
                  {totalCost?.toFixed(2)}
                  <span style={{ fontSize: '14px', fontWeight: '300' }}>
                    EUR/HT
                  </span>
                </Typography>
              </Box>
            </Box>
          </Drawer>
        </form>
      )}
    </Box>
  );
};

export default SimulationForm;
