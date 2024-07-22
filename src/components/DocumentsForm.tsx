import React, { FC, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  styled,
  TextField,
  Typography
} from '@mui/material';
import { Add, KeyboardArrowDownRounded, Remove } from '@mui/icons-material';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { documentsDefaultValues } from '@/data/documentsDefaultValues';
import { IDocumentsForm } from '@/interfaces/documents';
import { documentsFormSchema } from '@/form-schemas/documentsFormSchema';
import IconButton from '@mui/material/IconButton';
import { EmptyModal } from '@/components/EmptyModal';
import { AlertDot, RevenirButtom } from '@/components/atoms/styledComponents';
import Image from 'next/image';
import {
  documentsDictionary,
  fileInputsOne,
  productsDictionary,
  sortCountries,
  status
} from '../../utils/common';
import { NumericFormat } from 'react-number-format';
import { InputFile } from './atoms/FileInput';
import { useSelector } from 'react-redux';
import { appState } from '@/store';
import { useAppDispatch } from '@/hooks/redux';
import requestService from '@/services/request.service';
import showNotification from './atoms/Notification';
import {
  setUserRequestData,
  setSelectedProduct
} from '@/store/requests/reducer';
import { useRouter } from 'next/router';
import DocumentsByCountryForm from './DocumentsByCountryForm';
import { useTranslation } from 'react-i18next';

interface Props {
  onSubmit: (values: any) => void;
  handleBack?: () => void;
}

const ConfirmationModalContainer = styled(Box)((_) => ({
  height: '28rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}));

const DocumentsForm: FC<Props> = ({ handleBack }) => {
  /*hooks
   * */
  const dispatch = useAppDispatch();
  const router = useRouter();
  const requestData = useSelector(({ requests }: appState) => requests);
  const [subStep, setSubStep] = useState<number>(0);
  const [sizeUnits, setSizeUnits] = useState<any>();
  const [renderedFields, setRenderedFields] = useState([]);
  const { t, i18n } = useTranslation();
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  /*
   * hooks
   */
  const {
    control: documentsControl,
    handleSubmit: handeldocumentsSubmit,
    setValue,
    getValues,
    clearErrors,
    reset,
    formState: { errors: documentsErrors }
  } = useForm<IDocumentsForm>({
    defaultValues: documentsDefaultValues,
    // @ts-ignore
    resolver: yupResolver(documentsFormSchema)
  });
  useFieldArray<any>({
    control: documentsControl,
    name: 'nomenclature_codes'
  });
  const formValues = getValues();

  useEffect(() => {
    if (Object.keys(documentsErrors).length > 0) {
      showNotification({
        type: 'error',
        message: t('check_signaled_fields'),
        timeout: 5000
      });
    }
  }, [documentsErrors]);

  const confirmData = () => {
    validateAllProducts();
  };

  function validateAllProducts() {
    let isValid = true;

    requestData?.userData?.nomenclature_codes.forEach((data, dataIndex) => {
      data.products.forEach((product, productIndex) => {
        // Only validate the product at position 0
        if (productIndex === 0) {
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

          if (hasEmptyField) {
            showNotification({
              type: 'error',
              message: `${t('code')} ${data?.code} Produit 1 : ${t(
                'fields_required_empties'
              )}`,
              timeout: 2000
            });

            isValid = false;

            dispatch(
              setSelectedProduct({
                code: data?.code,
                codeIndex: dataIndex,
                productIndex: 0,
                product: data?.products?.[0]
              })
            );
          }
        }
      });
    });

    if (isValid) {
      if (!requestData?.userData?.documents) {
        dispatch(setSelectedProduct([]));
        return showNotification({
          type: 'error',
          message: t('documents_must_be_uploaded'),
          timeout: 2000
        });
      }

      const missingFields = renderedFields.filter(
        (fieldName) =>
          !requestData?.userData?.documents.some(
            (data) => data.type === fieldName
          )
      );

      if (missingFields.length == 0) return setShowConfirmationModal(true);

      dispatch(setSelectedProduct([]));
      return showNotification({
        type: 'error',
        message: t('documents_must_be_uploaded'),
        timeout: 2000
      });
    }

    // No return statement needed
  }

  const isFieldRendered = (item) => {
    if (
      item.countries &&
      !item.countries.includes(requestData?.userData?.country)
    ) {
      return false;
    }
    return true;
  };

  const updateRenderedFields = () => {
    const renderedFields = fileInputsOne
      .filter(isFieldRendered)
      .map((item) => item.type);
    setRenderedFields(renderedFields);
  };

  const getBase64 = (file: any, type: string, code?: string) => {
    if (!file) return null;

    const reader = new FileReader();

    reader.onload = () => {
      const base64String: any = reader.result;

      const withoutPrefix = base64String.split(',');

      uploadDocument(withoutPrefix[1], type, code, file?.name);
    };

    reader?.readAsDataURL(file);
  };

  const uploadDocument = async (
    base: any,
    type: string,
    code: string,
    name: string
  ) => {
    const updatedNomenclatureCodes =
      requestData?.userData?.nomenclature_codes.map((nomenclature) => {
        if (nomenclature.code === code) {
          // Update the structure for products
          const updatedProducts = nomenclature.products.map((product) => {
            // Check if the product matches the criteria for updating
            if (
              product.name === formValues.name &&
              product.unit_price === formValues.unit_price
              // Add other conditions as needed
            ) {
              // Update the specific key in the product
              return {
                ...formValues,
                documents: [
                  {
                    type: type,
                    base64: base,
                    filename: name
                  }
                ]
              };
            }
            return product;
          });

          // Preserve the rest of the nomenclature structure
          return {
            ...nomenclature,
            code: code,
            products: updatedProducts
          };
        }

        return nomenclature;
      });
    return uploadDocumentToTarget({
      nomenclature_codes: updatedNomenclatureCodes
    });
  };

  const uploadDocumentToTarget = async (payload) => {
    try {
      const { data, status } = await requestService.uploadDocuments(
        payload,
        requestData?.userData?.id
      );
      if (status === 200 || status === 201) {
        dispatch(setUserRequestData(data));

        dispatch(
          setSelectedProduct({
            code: requestData?.product?.code,
            codeIndex: requestData?.product?.codeIndex,
            productIndex: requestData?.product?.productIndex,
            product:
              data?.nomenclature_codes?.[requestData?.product?.codeIndex]
                ?.products?.[requestData?.product?.productIndex]
          })
        );
      }
    } catch (e) {
      showNotification({
        type: 'error',
        message: e?.response?.data?.message?.[0],
        timeout: 2000
      });
    }
  };

  const deleteDocument = async (type: string, code?, field?) => {
    const updatedNomenclatureCodes =
      requestData?.userData?.nomenclature_codes.map((nomenclature) => {
        if (nomenclature.code === code) {
          // Update the structure for products
          const updatedProducts = nomenclature.products.map((product) => {
            // Check if the product matches the criteria for updating
            if (product.name === requestData?.product?.product?.name) {
              // Update the specific key in the product
              return {
                ...product,

                documents: [
                  {
                    type: type
                  }
                ]
              };
            }
            return product;
          });

          // Preserve the rest of the nomenclature structure
          return {
            ...nomenclature,
            products: updatedProducts
          };
        }
        return nomenclature;
      });

    const payload = {
      nomenclature_codes: updatedNomenclatureCodes
    };

    try {
      const { data, status } = await requestService.uploadDocuments(
        payload,
        requestData?.userData?.id
      );
      if (status === 200 || status === 201) {
        setValue(field, null);
        showNotification({
          type: 'success',
          message: t('document_success'),
          timeout: 2000
        });
        dispatch(setUserRequestData(data));
        dispatch(
          setSelectedProduct({
            code: requestData?.product?.code,
            codeIndex: requestData?.product?.codeIndex,
            productIndex: requestData?.product?.productIndex,
            product:
              data?.nomenclature_codes?.[requestData?.product?.codeIndex]
                ?.products?.[requestData?.product?.productIndex]
          })
        );
      }
    } catch (e) {
      showNotification({
        type: 'error',
        message: e?.response?.data?.message?.[0],
        timeout: 2000
      });
    }
  };

  const postDocuments = async () => {
    const payload = {
      total_cost: Number(
        requestData?.hasCreatedCertificates
          ? (requestData?.totalCost + 40).toFixed(2)
          : requestData?.totalCost?.toFixed(2)
      ),
      status: 'IN_REVIEW'
    };

    try {
      const { status } = await requestService.updateData(
        payload,
        requestData?.userData?.id
      );
      if (status === 200 || status === 201) {
        showNotification({
          type: 'success',
          message: t('request_succes'),
          timeout: 2000
        });
        router.push({
          pathname: '/dashboard/user',
          query: { openModal: true }
        });
        dispatch(setUserRequestData([]));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const appendProducts = () => {
    const nomenclatureCopy = structuredClone(
      requestData?.userData?.nomenclature_codes
    );

    let qty = nomenclatureCopy[requestData?.product?.codeIndex].products.length;

    const newProduct = {
      name: `Produit ${
        nomenclatureCopy[requestData?.product?.codeIndex].products.length + 1
      } `,
      description: '',
      condition: '',
      quantity: 1,
      size_unit: '',
      unit_price: 1,
      model: '',
      brand: '',
      country_origin: '',
      standalone: true
    };

    nomenclatureCopy[requestData?.product?.codeIndex].products.push(newProduct);

    const payload = {
      nomenclature_codes: nomenclatureCopy
    };

    updateStepData(payload, true, {
      code: requestData?.product?.code,
      codeIndex: requestData?.product?.codeIndex,
      productIndex:
        nomenclatureCopy[requestData?.product?.codeIndex]?.products.length - 1,
      product: nomenclatureCopy[requestData?.product?.codeIndex]?.products[qty]
    });

    setValue('additionalDocument', null);
    setValue('testReport', null);
    setValue('technicalSheet', null);
  };

  const deleteProduct = () => {
    const nomenclatureCopy = structuredClone(
      requestData?.userData?.nomenclature_codes
    );

    if (
      nomenclatureCopy[requestData?.product?.codeIndex].products[
        requestData?.product?.productIndex
      ]?.standalone
    ) {
      nomenclatureCopy[requestData?.product?.codeIndex].products.splice(
        requestData?.product?.productIndex,
        1
      );

      const payload = {
        nomenclature_codes: nomenclatureCopy
      };

      updateStepData(payload);

      dispatch(setSelectedProduct([]));
    } else {
      showNotification({
        type: 'error',
        message: t('item_cant_deleted'),
        timeout: 2000
      });
    }
  };

  useEffect(() => {
    if (requestData?.product?.product) {
      clearErrors();
      return fillData(
        requestData?.product?.documents,
        requestData?.product?.product.documents,
        requestData?.product?.product
      );
    }
  }, [requestData?.product?.product]);

  useEffect(() => {
    getSizeUnitOptions();
    updateRenderedFields();
  }, []);

  const getSizeUnitOptions = async () => {
    try {
      const sizeUnits = await requestService.getSizeUnit();

      setSizeUnits(sizeUnits.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fillData = (documentsPath, documentProductPath, productPath) => {
    reset();

    documentsPath?.forEach((document) => {
      if (productsDictionary.hasOwnProperty(document.type)) {
        const mappedKey = productsDictionary[document.type];
        const mappedValue = document.key;

        setValue(mappedKey, mappedValue);
      }
    });

    documentProductPath?.forEach((documentProduct) => {
      if (productsDictionary.hasOwnProperty(documentProduct.type)) {
        const mappedKey = productsDictionary[documentProduct.type];
        const mappedValue = documentProduct.filename;

        setValue(mappedKey, mappedKey ? mappedValue : null);
      }
    });

    Object?.keys(productPath).forEach((key) => {
      if (documentsDictionary[key]) {
        const mappedKey = documentsDictionary?.[key];
        const mappedValue = requestData.product.product?.[key];

        setValue(mappedKey, mappedValue == '' ? null : mappedValue);
      }
    });
  };

  function parseNumberWithString(inputString) {
    // Replace commas with dots for proper parsing
    const stringWithDot = inputString.replace(/,/g, '.');

    // Parse the string to a number
    const parsedNumber = parseFloat(stringWithDot);

    // Check if the parsing was successful
    if (isNaN(parsedNumber)) {
      console.error('Invalid input. Unable to parse the number.');
      return null; // or any other appropriate value indicating an error
    }

    return parsedNumber;
  }

  const updateData = async (key: string, value) => {
    const updatedNomenclatureCodes =
      requestData?.userData?.nomenclature_codes.map((nomenclature) => {
        if (nomenclature.code === requestData?.product?.code) {
          const updatedProducts = nomenclature.products.map((product) => {
            if (product.name === requestData?.product?.product?.name) {
              // Update the specific key in the product
              return {
                ...product,
                name: requestData?.product?.product?.name,
                [key]: value
              };
            }
            return product;
          });

          // Preserve the rest of the nomenclature structure
          return {
            ...nomenclature,
            products: updatedProducts
          };
        }
        return nomenclature;
      });

    return updateStepData({ nomenclature_codes: updatedNomenclatureCodes });
  };

  const updateStepData = async (
    payload: any,
    isAppend?: boolean,
    appendData?: any
  ) => {
    try {
      const { data, status } = await requestService.putProductDocuments(
        payload,
        requestData?.userData?.id
      );
      if (status === 200 || status === 201) {
        const updatedUserData = {
          ...requestData.userData,
          nomenclature_codes: data?.nomenclature_codes
        };

        dispatch(setUserRequestData(updatedUserData));

        isAppend
          ? dispatch(setSelectedProduct(appendData))
          : dispatch(
              setSelectedProduct({
                code: requestData?.product?.code,
                codeIndex: requestData?.product?.codeIndex,
                productIndex: requestData?.product?.productIndex,
                product:
                  data?.nomenclature_codes?.[requestData?.product?.codeIndex]
                    ?.products?.[requestData?.product?.productIndex]
              })
            );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onError = () => {
    if (requestData?.product?.productIndex > 0) {
      clearErrors();
      confirmData();
    }
  };

  return (
    <Box sx={{ width: '80%', margin: '2rem auto', paddingBottom: '6rem' }}>
      <EmptyModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
      >
        <ConfirmationModalContainer>
          <AlertDot>
            <Image
              src={'/icons/heart-icon.svg'}
              alt={'alt'}
              width={20}
              height={20}
            />
          </AlertDot>
          <Box sx={{ width: '100%', paddingX: '3rem' }}>
            <Typography
              variant={'body2'}
              sx={{
                textAlign: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                mb: '1rem',
                color: 'success.main'
              }}
            >
              {t('congratulations')}
            </Typography>
            <Typography
              variant={'body2'}
              sx={{ textAlign: 'center', fontSize: '18px', mb: '2rem' }}
            >
              {t('your_file_is_completed')}
            </Typography>
            <Typography
              variant={'body2'}
              sx={{
                textAlign: 'left',
                fontSize: '18px',
                paddingLeft: '1rem',
                mb: '1rem'
              }}
            >
              {t('certificate_pvoc')}
              <strong>{requestData?.totalCost}€ HT</strong>
            </Typography>
            <Typography
              variant={'body2'}
              sx={{
                textAlign: 'left',
                fontSize: '18px',
                paddingLeft: '1rem',
                mb: '1rem'
              }}
            >
              {t('yvea_support')}
              <strong>
                {requestData?.hasCreatedCertificates ? '40' : '0'}€ HT
              </strong>
            </Typography>
            <Typography
              variant={'body2'}
              sx={{
                textAlign: 'left',
                fontSize: '18px',
                paddingLeft: '1rem',
                mb: '2rem'
              }}
            >
              {`Total HT : `}
              <strong>
                {requestData?.hasCreatedCertificates
                  ? (requestData?.totalCost + 40).toFixed(2)
                  : requestData?.totalCost?.toFixed(2)}
                € HT
              </strong>
            </Typography>
            {/*Certificat PVoC : 600€ HT Accompagnement YVEA : 40€ HT Total HT : 640€ HT*/}
          </Box>
          <Button
            variant={'contained'}
            onClick={() => {
              setShowConfirmationModal(false);
              postDocuments();
            }}
            sx={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
          >
            {t('i_submit_form')}
          </Button>
          <RevenirButtom
            variant={'text'}
            onClick={() => setShowConfirmationModal(false)}
          >
            {t('i_modify_entrie')}
          </RevenirButtom>
        </ConfirmationModalContainer>
      </EmptyModal>

      {requestData?.product?.length == 0 && (
        <DocumentsByCountryForm
          handleBack={handleBack}
          handleContinue={() => {
            setSubStep(subStep + 1);
            dispatch(
              setSelectedProduct({
                code: requestData?.userData?.nomenclature_codes[0]?.code,
                codeIndex: 0,
                productIndex: 0,
                product:
                  requestData?.userData?.nomenclature_codes[0]?.products?.[0]
              })
            );
          }}
        />
      )}
      {typeof requestData?.product === 'object' && (
        <form onSubmit={handeldocumentsSubmit(confirmData, onError)}>
          {requestData?.product?.product && (
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                display={'flex'}
                justifyContent={'space-between'}
              >
                <Typography variant={'h6'}>
                  {requestData?.product?.code} – {t('name_nomenclature')}
                </Typography>
                <Chip
                  label={t('to_be_completed')}
                  sx={{
                    backgroundColor: 'warning.50',
                    color: 'warning.700',
                    fontWeight: 'bold'
                  }}
                />
              </Grid>
              <Divider sx={{ width: '97%', margin: '2rem auto 1rem' }} />
              <Chip
                label={t('products_documents_completed')}
                sx={{
                  backgroundColor: 'warning.50',
                  color: 'warning.700',
                  fontWeight: 'bold'
                }}
              />

              <Grid item xs={12} marginBottom={'.3rem'} marginTop={'1rem'}>
                <Typography
                  fontSize={'1rem'}
                  marginBottom={'1rem'}
                  fontWeight={'600'}
                >
                  {t(requestData?.product?.product?.name)}
                </Typography>
                <FormControl fullWidth>
                  <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                    {`${t('description')}*`}
                  </Typography>
                  <Controller
                    name={'description'}
                    control={documentsControl}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        onChange={onChange}
                        placeholder={t('description')}
                        onBlur={() => updateData('description', value)}
                        error={!!documentsErrors.description}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} marginBottom={'.3rem'}>
                <FormControl fullWidth>
                  <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                    {`${t('condition')}*`}
                  </Typography>
                  <Controller
                    name={'condition'}
                    control={documentsControl}
                    render={({ field: { value, onChange } }) => (
                      <FormControl fullWidth>
                        <Select
                          value={value}
                          onChange={onChange}
                          onBlur={() => updateData('condition', value)}
                          placeholder={t('condition')}
                          error={!!documentsErrors?.condition}
                          labelId="condition-label"
                          displayEmpty
                          IconComponent={() => <KeyboardArrowDownRounded />}
                        >
                          <MenuItem value={null} disabled>
                            {t('choose')}
                          </MenuItem>
                          {status.map((unit) => (
                            <MenuItem key={unit.id} value={unit.id}>
                              {t(unit.name)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                    {`${t('quantity')}*`}
                  </Typography>
                  <Controller
                    name={'quantity'}
                    control={documentsControl}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        label="Quantité"
                        value={value}
                        type="number"
                        onChange={onChange}
                        onBlur={() => updateData('quantity', value)}
                        placeholder={t('quantity')}
                        error={!!documentsErrors?.quantity}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                    {`${t('unit_size')}`}
                  </Typography>

                  <Controller
                    name={'size_unit'}
                    control={documentsControl}
                    render={({ field: { value, onChange } }) => (
                      <FormControl fullWidth>
                        <Select
                          value={value}
                          onChange={onChange}
                          onBlur={() => updateData('size_unit', value)}
                          placeholder={t('unit_size')}
                          error={!!documentsErrors?.size_unit}
                          labelId="country-label"
                          displayEmpty
                          IconComponent={() => <KeyboardArrowDownRounded />}
                        >
                          <MenuItem value={null} disabled>
                            {t('choose')}
                          </MenuItem>
                          {sizeUnits?.map((unit) => (
                            <MenuItem key={unit.id} value={unit.id}>
                              {unit.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                    {`${t('unit_price')} *`}
                  </Typography>
                  <Controller
                    name={'unit_price'}
                    control={documentsControl}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        onChange={onChange}
                        onBlur={() =>
                          updateData('unit_price', parseNumberWithString(value))
                        }
                        InputProps={{
                          inputComponent: NumberFormatCustom as any,
                          startAdornment: (
                            <InputAdornment position="start">€</InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">EUR</InputAdornment>
                          )
                        }}
                        placeholder=""
                        error={!!documentsErrors?.unit_price}
                        helperText={documentsErrors?.unit_price?.message}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                    {`${t('model')}`}
                  </Typography>
                  <Controller
                    name={'model'}
                    control={documentsControl}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        onBlur={() => updateData('model', value)}
                        placeholder={'M°'}
                        type={'text'}
                        onChange={onChange}
                        error={!!documentsErrors?.model}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                    {`${t('manufacture_name')} *`}
                  </Typography>
                  <Controller
                    name={'brand'}
                    control={documentsControl}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        onBlur={() => updateData('brand', value)}
                        placeholder={t('manufacture_name')}
                        type={'text'}
                        onChange={onChange}
                        error={!!documentsErrors?.brand}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography sx={{ fontSize: '13px', mb: '10px' }}>
                    {`${t('origin')} *`}
                  </Typography>
                  <Controller
                    name={'country_origin'}
                    control={documentsControl}
                    render={({ field: { value, onChange } }) => (
                      <FormControl fullWidth>
                        <Select
                          value={value}
                          onChange={onChange}
                          onBlur={() => updateData('country_origin', value)}
                          placeholder={t('origin')}
                          error={!!documentsErrors?.country_origin}
                          labelId="country-label"
                          displayEmpty
                          IconComponent={() => <KeyboardArrowDownRounded />}
                        >
                          <MenuItem value={null} disabled>
                            {t('origin')}
                          </MenuItem>
                          {sortCountries(i18n?.language).map((country) => (
                            <MenuItem key={country.id} value={country.id}>
                              {t(country.name)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid xs={6} item paddingX={'1rem'} marginTop={'2rem'}>
                <InputFile
                  name={'technicalSheet'}
                  tooltipMessage={t('descriptive_document')}
                  label={`${t('technical_sheet')} *`}
                  control={documentsControl}
                  fileMethod={(value: any) => {
                    getBase64(
                      value,
                      'TECHNICAL_SHEET_OR_PRODUCT_DESCRIPTIVE',

                      requestData?.product?.code
                    );
                    setValue('technicalSheet', value?.name);
                  }}
                  deleteMethod={() => {
                    deleteDocument(
                      'TECHNICAL_SHEET_OR_PRODUCT_DESCRIPTIVE',

                      requestData?.product?.code,
                      'technicalSheet'
                    );
                  }}
                  externalName={formValues?.technicalSheet}
                  inputRef={inputRef.current}
                  loading={false}
                  error={!!documentsErrors?.technicalSheet}
                  errorMessage={documentsErrors?.technicalSheet?.message}
                />
              </Grid>

              <Grid xs={6} item paddingX={'1rem'} marginTop={'2rem'}>
                <InputFile
                  name={'testReport'}
                  tooltipMessage={t('may_be_external_or_internal')}
                  label={`${t('test_report')} *`}
                  control={documentsControl}
                  fileMethod={(value: any) => {
                    getBase64(
                      value,
                      'TEST_REPORT_OR_ANALYSIS_CERTIFICATE',

                      requestData?.product?.code
                    );
                    setValue('testReport', value?.name);
                  }}
                  externalName={formValues?.testReport}
                  inputRef={inputRef.current}
                  loading={false}
                  deleteMethod={() => {
                    deleteDocument(
                      'TEST_REPORT_OR_ANALYSIS_CERTIFICATE',

                      requestData?.product?.code,
                      'testReport'
                    );
                  }}
                  error={!!documentsErrors?.testReport}
                  errorMessage={documentsErrors?.testReport?.message}
                />
              </Grid>

              <Grid xs={12} item paddingX={'1rem'} marginTop={'2rem'}>
                <InputFile
                  label={t('another_document')}
                  name={'additionalDocument'}
                  tooltipMessage={t('add_another_product')}
                  control={documentsControl}
                  fileMethod={(value: any) => {
                    getBase64(
                      value,
                      'GOEIC_REGISTRATION',

                      requestData?.product?.code
                    );
                    setValue('additionalDocument', value?.name);
                  }}
                  deleteMethod={() => {
                    deleteDocument(
                      'GOEIC_REGISTRATION',

                      requestData?.product?.code,
                      'additionalDocument'
                    );
                  }}
                  externalName={formValues?.additionalDocument}
                  inputRef={inputRef.current}
                  loading={false}
                  error={!!documentsErrors?.additionalDocument}
                  errorMessage={documentsErrors?.additionalDocument?.message}
                />
              </Grid>
              <Grid item xs={6} marginTop={'1rem'}>
                <Box
                  display={'flex'}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    appendProducts();
                  }}
                >
                  <IconButton
                    sx={{
                      border: '1px dashed lightgrey ',
                      height: '1.5rem',
                      width: '1.5rem'
                    }}
                  >
                    <Add />
                  </IconButton>
                  <Typography
                    sx={{
                      color: 'primary.main',
                      fontWeight: '600',
                      ml: '.5rem'
                    }}
                  >
                    {t('add_product')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} justifyContent={'flex-end'} marginTop={'1rem'}>
                <Box
                  display={'flex'}
                  justifyContent={'flex-end'}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    deleteProduct();
                  }}
                >
                  <IconButton
                    sx={{
                      border: '1px dashed lightgrey ',
                      height: '1.5rem',
                      width: '1.5rem'
                    }}
                  >
                    <Remove />
                  </IconButton>
                  <Typography
                    sx={{
                      color: 'primary.main',
                      fontWeight: '600',
                      ml: '.5rem'
                    }}
                  >
                    {t('remove_product')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}

          {requestData?.product?.product && (
            <Grid
              item
              xs={12}
              marginTop={'3rem'}
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Button
                variant={'outlined'}
                onClick={() => dispatch(setSelectedProduct([]))}
                sx={{
                  textTransform: 'none',
                  color: 'text.secondary',
                  borderColor: 'text.disabled'
                }}
              >
                {t('previous_step')}
              </Button>
              {/* <Typography
                     sx={{ fontWeight: 'bold', textDecoration: 'underline' }}
                   >
                     Precedent
                   </Typography>
                   <Typography
                     sx={{ fontWeight: 'bold', textDecoration: 'underline' }}
                   >
                     Suivant
                   </Typography> */}

              <Button
                type="submit"
                variant={'contained'}
                sx={{ textTransform: 'none' }}
              >
                {t('next_step')}
              </Button>
            </Grid>
          )}
          {!Array.isArray(requestData?.product) &&
            !requestData?.product.product && (
              <Typography variant={'h6'} textAlign={'center'}>
                {t('please_select_product')}
              </Typography>
            )}
        </form>
      )}
    </Box>
  );
};

export default DocumentsForm;

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props) {
  const { ...other } = props;
  return (
    <NumericFormat
      {...other}
      type="text"
      decimalSeparator=","
      decimalScale={2}
    />
  );
});
