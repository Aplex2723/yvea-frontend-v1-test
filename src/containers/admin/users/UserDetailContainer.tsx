import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { useRouter } from 'next/router';
import UserInformation from '@/containers/userDetail/UserInformation';
import requestService from '@/services/request.service';
import accountServices from '@/services/account.service';
import { EnumTypeDatatable } from '@/interfaces/enums';
import headers from '@/data/headers.json';
import { Datatable } from '@/components/GenericDataTable';
import { useTranslation } from 'react-i18next';

const UserDetailContainer: FC = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>();
  const [userCertificates, setUserCertificates] = useState<any>();
  const [selectedTab, setSelectedTab] = useState('information');
  const { t } = useTranslation();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    getUserData();
    getUserCertificates();
  }, [id]);

  const getUserData = async () => {
    try {
      const user = await accountServices.getUserData(id);
      setUserData(user.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserCertificates = async () => {
    try {
      const certificates = await requestService.getCertificatesByUser(id);
      setUserCertificates(certificates.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const goBack = () => {
    router.back();
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

  const children = [
    <ToggleButton
      value="information"
      key="left"
      sx={{ borderRadius: '8px', textTransform: 'none' }}
    >
      {t('informations')}
    </ToggleButton>,
    <ToggleButton
      value="demande"
      key="center"
      sx={{ borderRadius: '8px', textTransform: 'none' }}
    >
      {t('documents')}
    </ToggleButton>
  ];

  return (
    /*container box*/
    <Box sx={{ width: '90%', margin: '0rem auto' }}>
      <Box display={'flex'} alignItems={'center'} marginTop={'2rem'}>
        <ArrowBackOutlinedIcon
          onClick={() => goBack()}
          sx={{ mr: '1rem', cursor: 'pointer' }}
        />
        <Typography variant={'h4'} fontWeight={'bold'}>
        {userData?.first_name} {userData?.last_name}
        </Typography>
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
        <UserInformation userData={userData} />
      ) : (
        <>
          {userCertificates?.length > 0 ? (
            <Datatable
              type={EnumTypeDatatable.DOCUMENTS}
              headers={headers.documents}
              localData={userCertificates}
            />
          ) : (
            <Typography
              marginTop={'3rem'}
              variant="h6"
              color={'grey.800'}
              fontWeight={'500'}
            >
              {t('no_documents_provided')}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default UserDetailContainer;
