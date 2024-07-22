import React, { FC, useEffect, useRef, useState } from 'react';
import { Button, Chip, Divider, Grid, Typography } from '@mui/material';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { documentsByCountryFormSchema } from '@/form-schemas/documentsByCountryFormSchema';

import {
  documentsByCountryDictionary,
  fileInputsOne
} from '../../utils/common';

import { InputFile } from './atoms/FileInput';
import { useSelector } from 'react-redux';
import { appState } from '@/store';
import { useAppDispatch } from '@/hooks/redux';
import requestService from '@/services/request.service';
import showNotification from './atoms/Notification';
import { setUserRequestData } from '@/store/requests/reducer';
import { IDocumentsByCountryForm } from '@/interfaces/documentsByCountry';
import { documentsByCountryDefaultValues } from '@/data/documentsByCountryDefaultValues';
import { useTranslation } from 'react-i18next';

interface Props {
  handleBack?: () => void;
  handleContinue?: () => void;
}

const DocumentsByCountryForm: FC<Props> = ({ handleBack, handleContinue }) => {
  /*hooks
   * */
  const dispatch = useAppDispatch();
  const [renderedFields, setRenderedFields] = useState([]);
  const requestData = useSelector(({ requests }: appState) => requests);
  const { t } = useTranslation();

  const inputRef = useRef<HTMLInputElement>(null);
  const selectedCountry =
    requestData?.userData?.country?.charAt(0) +
    requestData?.userData?.country?.slice(1)?.toLowerCase();
  /*
   * hooks
   */
  const {
    control: documentsByCountryControl,
    handleSubmit: handeldocumentsByCountrySubmit,
    setValue,
    getValues,
    setError,
    formState: { errors: documentsByCountryErrors }
  } = useForm<IDocumentsByCountryForm>({
    defaultValues: documentsByCountryDefaultValues,
    // @ts-ignore
    resolver: yupResolver(documentsByCountryFormSchema)
  });

  const formValues = getValues();

  useEffect(() => {        
    if(Object.keys(documentsByCountryErrors).length > 0){
      showNotification({
        type: 'error',
        message: t('check_signaled_fields'),
        timeout: 5000
      });
    }
  }, [documentsByCountryErrors])

  const getBase64 = (file: any, type: string) => {
    if (!file) return null;

    const reader = new FileReader();

    reader.onload = () => {
      const base64String: any = reader.result;

      const withoutPrefix = base64String.split(',');

      uploadDocument(withoutPrefix[1], type, file?.name);
    };

    reader?.readAsDataURL(file);
  };

  const uploadDocument = async (base: any, type: string, name: string) => {
    const payload = {
      documents: [
        {
          base64: base,
          type: type,
          filename: name
        }
      ]
    };

    return uploadDocumentToTarget(payload);
  };

  const uploadDocumentToTarget = async (payload) => {
    try {
      const { data, status } = await requestService.uploadDocuments(
        payload,
        requestData?.userData?.id
      );
      if (status === 200 || status === 201) {
        dispatch(setUserRequestData(data));
      }
    } catch (e) {
      showNotification({
        type: 'error',
        message: e?.response?.data?.message?.[0],
        timeout: 2000
      });
    }
  };

  const deleteDocument = async (type: string, field?) => {
    const payload = {
      documents: [
        {
          type: type
        }
      ]
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
      }
    } catch (e) {
      showNotification({
        type: 'error',
        message: e?.response?.data?.message?.[0],
        timeout: 2000
      });
    }
  };

  useEffect(() => {
    if (requestData?.userData?.documents) {
      return fillData(requestData?.userData?.documents);
    }
  }, [requestData?.userData]);

  const fillData = (documentsPath) => {
    documentsPath?.forEach((document) => {
      if (documentsByCountryDictionary.hasOwnProperty(document.type)) {
        const mappedKey = documentsByCountryDictionary[document.type];
        const mappedValue = document.filename;

        setValue(mappedKey, mappedValue);
      }
    });
  };

  const validateSecondStep = () => {
    const fieldsWithNullValues = renderedFields.filter(
      (fieldName) => formValues[fieldName] === null
    );

    if (fieldsWithNullValues.length == 0) return handleContinue();

    fieldsWithNullValues.forEach((fieldName) => {
      setError(fieldName, {
        type: 'manual',
        message: `${t(fieldName)} ${t('is_required')}`
      });
    });
  };

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
      .map((item) => item.field);
    setRenderedFields(renderedFields);
  };

  useEffect(() => {
    updateRenderedFields();
  }, []);

  return (
    <form onSubmit={handeldocumentsByCountrySubmit(validateSecondStep)}>
      <Grid container spacing={2} marginTop={'1.5rem'}>
        <Grid item xs={12} display={'flex'} justifyContent={'space-between'}>
          <Typography variant={'h6'}>
            {t('import_documents')} {selectedCountry ?? ''}
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

        <Divider sx={{ width: '97%', margin: ' 2rem auto' }} />
        {fileInputsOne.map((item) => {
          if (!renderedFields.includes(item.field)) {
            return null;
          }
          return (
            <Grid
              xs={6}
              item
              key={item?.name}
              paddingX={'1rem'}
              marginTop={'2rem'}
            >
              <InputFile
                name={item?.field}
                tooltipMessage={t(item?.tooltip)}
                control={documentsByCountryControl}
                fileMethod={(value: any) => {
                  getBase64(value, item?.type);
                  setValue(item?.field as any, value?.name);
                }}
                deleteMethod={() => {
                  deleteDocument(item?.type, item?.field);
                }}
                externalName={formValues[item?.field]}
                inputRef={inputRef}
                loading={false}
                label={`${t(item.field)} *`}
                error={!!documentsByCountryErrors[item?.field]}
                errorMessage={documentsByCountryErrors[item?.field]?.message}
              />
            </Grid>
          );
        })}
      </Grid>
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
          onClick={() => validateSecondStep()}
          variant={'contained'}
          sx={{ textTransform: 'none' }}
        >
          {t('next_step')}
        </Button>
      </Grid>
    </form>
  );
};

export default DocumentsByCountryForm;
