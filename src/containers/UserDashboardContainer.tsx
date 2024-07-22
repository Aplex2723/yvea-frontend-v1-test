import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Typography, styled } from '@mui/material';

import { EmptyModal } from '@/components/EmptyModal';
import { AlertDot } from '@/components/atoms/styledComponents';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Datatable } from '@/components/GenericDataTable';
import { EnumTypeDatatable } from '@/interfaces/enums';
import headers from '@/data/headers.json';
import { ROUTES } from '@/constans/routes';
import { useAppDispatch } from '@/hooks/redux';
import { setStep, setUserRequestData, updateDraftState } from '@/store/requests/reducer';
import { useTranslation } from 'react-i18next';

const ConfirmationModalContainer = styled(Box)((_) => ({
  height: '20rem',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}));

const UserDashboardContainer: NextPage = () => {
  const router = useRouter();
  const { openModal } = router.query;
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<any>(openModal);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    dispatch(setStep(0));
  }, []);

  return (
    <>
      <EmptyModal
        isOpen={showConfirmationModal}
        onClose={() => {
          router.replace('/dashboard/user')
          setShowConfirmationModal(false);
        }}
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
          <Box sx={{ width: '100%', paddingX: '2rem' }}>
            <Typography
              variant={'body2'}
              sx={{
                textAlign: 'center',
                fontSize: '30px',
                fontWeight: 'bold',
                mb: '1rem',
                color: 'text.primary'
              }}
            >
              {t('its_all_good')}
            </Typography>
            <Typography
              variant={'body2'}
              sx={{ textAlign: 'center', fontSize: '1rem', mb: '2rem' }}
            >
              {t('we_will_proccess_your_file')}
              <span style={{ fontWeight: '600',whiteSpace: 'nowrap'}}>{t('follow_up')}</span>
            </Typography>
          </Box>
          <Button
            variant={'contained'}
            onClick={() => {
              router.replace('/dashboard/user')
              setShowConfirmationModal(false);
            }}
            sx={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
          >
            {t('super')}
          </Button>
        </ConfirmationModalContainer>
      </EmptyModal>
      <Box
        padding={'0rem 2rem 2rem 2rem'}
        sx={{ minHeight: '100vh' }}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        flexDirection={'column'}
      >
        <Box
          sx={{
            width: { md: '100%' },
            paddingTop: '2rem',

            height: '100%',
            margin: 'auto'
          }}
        >
          {/* <InsertChartOutlinedIcon /> */}
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography sx={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
              {t('request_tracking')}
            </Typography>

            <Button
              variant={'contained'}
              onClick={() => {
                dispatch(setStep(0));
                dispatch(setUserRequestData([]));
                dispatch(updateDraftState(false))
                router.push(ROUTES.USER_DASHBOARD_REQUEST);
              }}
              sx={{ backgroundColor: 'secondary.main', mt: '1rem' }}
            >
              {t('create_request_two')}
            </Button>
          </Box>

          <Datatable
            type={EnumTypeDatatable.CERTIFICATES}
            headers={headers.certificates}
          />
        </Box>
      </Box>
    </>
  );
};

export default UserDashboardContainer;
