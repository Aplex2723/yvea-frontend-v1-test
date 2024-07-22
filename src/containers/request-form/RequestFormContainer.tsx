import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import {
  Box,
  Button,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
  StepLabel,
  Stepper,
  styled,
  Typography
} from '@mui/material';
import SimulationForm from '@/components/SimulationForm';
import PrestatariesForm from '@/components/PrestatariesForm';
import ExpeditionForm from '@/components/ExpeditionForm';
import DocumentsForm from '@/components/DocumentsForm';
import { Check } from '@mui/icons-material';
import { ISimulation } from '@/interfaces/simulation';
import { ICountry } from '@/interfaces/common';
import requestService from '@/services/request.service';
import { useSelector } from 'react-redux';
import { appState } from '@/store';
import {
  setSelectedProduct,
  setShippingValues,
  setStep
} from '@/store/requests/reducer';
import { useAppDispatch } from '@hooks/redux';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const steps = ['simulation', 'service_providers', 'shipping', 'documents'];

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 10,
    alignItems: 'center',
    ...(ownerState.active && {
      color: '#1B019B'
    }),
    '& .QontoStepIcon-completedIcon': {
      color: '#1B019B',
      zIndex: 1,
      fontSize: 18
    },
    '& .QontoStepIcon-circle': {
      width: 9,
      height: 9,
      border: '2px solid',
      borderRadius: '50%',
      borderColor: 'currentColor'
    }
  })
);

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    left: 'calc(-50%)',
    right: 'calc(50%)'
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#1B019B'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#1B019B'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderWidth: 2,
    marginLeft: -7,
    borderRadius: 1
  }
}));

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

const RequestFormContainer: NextPage = () => {
  /*
   * hooks
   * */
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const requestData = useSelector(({ requests }: appState) => requests);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [activeStep, setActiveStep] = React.useState(requestData?.step ?? 0);
  const [_, setEditionId] = useState<number>(null);
  const [completedSteps, setCompletedSteps] = useState<{
    simulationStep: ISimulation;
  }>({
    simulationStep: null
  });
  useEffect(() => {
    getCountries();
  }, [i18n.language]);

  useEffect(() => {
    dispatch(setShippingValues(null));
  }, []);

  const getCountries = async () => {
    try {
      const countries = await requestService.getCountries();
      setCountries(countries.data);
    } catch (error) {
      console.log(error);
    }
  };

  const simulationFormSucced = (id: number, value: ISimulation) => {
    setEditionId(id);
    setCompletedSteps({
      ...completedSteps,
      simulationStep: value
    });
    dispatch(setStep(activeStep + 1));
    setActiveStep(activeStep + 1);
  };

  const setCurrentProductForm = (
    product: any,
    projectCode: string | number,
    id: string | number,
    index: string | number
  ) => {
    const payload = {
      code: projectCode,
      codeIndex: id,
      productIndex: index,
      product: product
    };

    dispatch(setSelectedProduct(payload));
  };

  function validateProduct(code, product) {
    if (
      requestData?.product?.code == code &&
      requestData?.product?.product?.name == product?.name
    )
      return 'primary.main';

    const requiredFields = [
      'unit_price',
      'quantity',
      'brand',
      'description',
      'TECHNICAL_SHEET_OR_PRODUCT_DESCRIPTIVE',
      'TEST_REPORT_OR_ANALYSIS_CERTIFICATE'
    ];

    const hasEmptyField = requiredFields.some((field) => {
      if (
        field === 'TECHNICAL_SHEET_OR_PRODUCT_DESCRIPTIVE' ||
        field === 'TEST_REPORT_OR_ANALYSIS_CERTIFICATE'
      ) {
        return (
          !product.documents ||
          !product.documents.some((doc) => doc.type === field)
        );
      }
      return !product[field];
    });

    return hasEmptyField ? 'error.main' : 'success.main';
  }

  const translatesProduct = (name: any) => {
    let word = name.split(' ');

    return `${t('product')} ${word[1]}`;
  };

  const getActiveForm = (step: number) => {
    switch (step) {
      case 0:
        return (
          <SimulationForm
            onSucceed={simulationFormSucced}
            // simulationData={completedSteps.simulationStep}
            // id={editionId}
            countries={countries}
          />
        );
      case 1:
        return (
          <PrestatariesForm
            onSubmit={(values) => console.log(values)}
            handleBack={() => {
              setActiveStep(activeStep - 1);
              dispatch(setStep(activeStep - 1));
            }}
            nextStep={() => {
              setActiveStep(activeStep + 1);
              dispatch(setStep(activeStep + 1));
            }}
          />
        );
      case 2:
        return (
          <ExpeditionForm
            onSubmit={(values) => console.log(values)}
            handleBack={() => {
              setActiveStep(activeStep - 1);
              dispatch(setStep(activeStep - 1));
            }}
            nextStep={() => {
              setActiveStep(activeStep + 1);
              dispatch(setStep(activeStep + 1));
            }}
          />
        );
      case 3:
        return (
          <>
            <Stepper
              orientation={'vertical'}
              activeStep={0}
              connector={<QontoConnector />}
              sx={{
                position: 'fixed',
                left: '3.5rem',
                overflowY: 'scroll',
                maxHeight: '70vh',
                paddingRight: '1rem'
              }}
            >
              <Step key={'step1'}>
                <StepLabel StepIconComponent={QontoStepIcon}>
                  {t('general_documents')}
                </StepLabel>
              </Step>
              {(requestData?.userData?.nomenclature_codes ?? []).map(
                (code, id) => {
                  let count = 0;
                  return (
                    <Step key={`step${count++}`}>
                      <StepLabel
                        StepIconComponent={QontoStepIcon}
                        // sx={{ color: validateProduct(code) }}
                      >
                        {code?.code}
                      </StepLabel>
                      {(code?.products ?? []).map((product, index) => {
                        return (
                          <Box
                            key={`product${index}`}
                            display={'flex'}
                            justifyContent={'flex-start'}
                            onClick={() => {
                              setCurrentProductForm(
                                product,
                                code?.code,
                                id,
                                index
                              );
                            }}
                          >
                            <Typography
                              marginLeft={'1.2rem'}
                              fontSize={'0.75rem'}
                              color={validateProduct(code?.code, product)}
                            >
                              &#9679;
                            </Typography>
                            <Typography
                              marginLeft={'0.2rem'}
                              fontSize={'0.75rem'}
                              color={validateProduct(code?.code, product)}
                              sx={{
                                cursor: 'pointer',
                                textDecoration:
                                  requestData?.product?.code == code?.code &&
                                  requestData?.product?.product?.name ==
                                    product?.name
                                    ? 'underline'
                                    : 'none'
                              }}
                            >
                              {translatesProduct(product?.name)}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Step>
                  );
                }
              )}
            </Stepper>
            <DocumentsForm
              onSubmit={(values) => console.log(values)}
              handleBack={() => {
                setActiveStep(activeStep - 1);
                dispatch(setStep(activeStep - 1));
              }}
            />
          </>
        );
    }
  };

  const updateStatusAndGoBack = () => {
    router.push('/dashboard/user');
  };

  return (
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
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{t(label)}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {/*form container*/}
        <Box>
          <Button
            variant={'text'}
            onClick={updateStatusAndGoBack}
            sx={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              textTransform: 'capitalize'
            }}
          >
            {t('return_to_dashboard')}
          </Button>
          {getActiveForm(requestData?.step)}
        </Box>
      </Box>
    </Box>
  );
};

export default RequestFormContainer;
