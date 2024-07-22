import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { useRouter } from 'next/router';
import requestService from '@/services/request.service';
import { certificateStatus, statusColors } from '../../utils/common';
import { KeyboardArrowDownRounded } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { appState } from '@/store';
import { EnumCerficatesStatus, EnumTypeDatatable } from '@/interfaces/enums';
import CerticateInformation from './certificateDetails/certficateInformation';
import { Datatable } from '@/components/GenericDataTable';
import headers from '@/data/headers.json';
import showNotification from '@/components/atoms/Notification';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';

const CerticateDetailContainer: FC = () => {
  const {t} = useTranslation()
  const router = useRouter();
  const { certificateId } = router.query;
  const [status, setStatus] = useState<string>();
  const [certificateData, setCertificateData] = useState<any>();
  const { roleName } = useSelector(({ users }: appState) => users);
  const [selectedTab, setSelectedTab] = useState('information');
  const [documents, setDocuments] = useState<any>();

  const children = [
    <ToggleButton
      value="information"
      key="left"
      sx={{ borderRadius: '8px', textTransform: 'none' }}
    >
      Informations
    </ToggleButton>,
    <ToggleButton
      value="demande"
      key="center"
      sx={{ borderRadius: '8px', textTransform: 'none' }}
    >
      Documents
    </ToggleButton>
  ];

  useEffect(() => {
    getCertificateData();
  }, [certificateId]);

  const getCertificateData = async () => {
    try {
      const certitificate = await requestService.getCertificate(certificateId);
      setCertificateData(certitificate.data);
      setStatus(certitificate.data?.status);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setSelectedTab(newAlignment);
  };

  const control = {
    value: selectedTab,
    onChange: handleChange,
    exclusive: true
  };

  function extractData(inputData) {
    const { documents, nomenclature_codes, id, title } = inputData;

    const combinedDocuments = nomenclature_codes?.map(({ code, products }) => {
      const combinedProducts = products?.map(
        ({ name, documents: productDocuments }) => ({
          name,
          documents: productDocuments ? [...productDocuments] : []
        })
      );
      return { code, products: combinedProducts };
    });

    setDocuments([
      {
        id,
        title,
        nomenclature_codes: combinedDocuments,
        documents
      }
    ]);
  }

  const changeStatus = async (value) => {
    setStatus(value);
    try {
      const { status } = await requestService.updateData(
        { status: value },
        certificateId
      );
      if (status === 200 || status === 201) {
        showNotification({
          type: 'success',
          message: t('updated_request'),
          timeout: 2000
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (certificateData) extractData(certificateData);
  }, [certificateData]);

  return (
    <Box
      width={'90%'}
      margin={'0rem auto'}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'flex-start'}
      alignItems={'flex-start'}
    >
      <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
        <IconButton sx={{ paddingLeft: 0 }} onClick={() => router.back()}>
          <ArrowBackIcon />
        </IconButton>

        <Typography fontSize={'1.125rem'}>{certificateData?.title}</Typography>
        {roleName !== 'CLIENT' ? (
          <Box width={'15rem'} marginLeft={'1rem'}>
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                label="Condition"
                value={status}
                onChange={(e) => changeStatus(e?.target?.value)}
                placeholder="Status"
                labelId="condition-label"
                displayEmpty
                IconComponent={() => <KeyboardArrowDownRounded />}
              >
                <MenuItem value="" disabled>
                  Choisissez
                </MenuItem>
                {certificateStatus.map((status: any) => (
                  <MenuItem key={status.id} value={status.id}>
                    {t(status.id)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ) : (
          <Typography
            paddingX="1rem"
            variant="body1"
            marginLeft={'1rem'}
            width={'max-content'}
            color={statusColors[status]}
            borderRadius={'1rem'}
          >
            {t(EnumCerficatesStatus[status])}
          </Typography>
        )}
      </Box>
      <Stack spacing={2} alignItems="start" sx={{ mt: '2rem' }}>
        <ToggleButtonGroup
          {...control}
          color={'primary'}
          aria-label="Medium sizes"
        >
          {children}
        </ToggleButtonGroup>
      </Stack>

      {selectedTab === 'information' ? (
        <CerticateInformation certficateData={certificateData} />
      ) : (
        <Datatable
          type={EnumTypeDatatable.DOCUMENTS}
          headers={headers.documents}
          localData={documents}
        />
      )}
    </Box>
  );
};

export default CerticateDetailContainer;
