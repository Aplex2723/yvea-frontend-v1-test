import React, { FC, useEffect, useState } from 'react';
import { EmptyModal } from '@components/EmptyModal';
import { Box, IconButton, Typography } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { ICountry } from '@/interfaces/common';
import requestService from '@/services/request.service';
import EditSellerForm from '@components/EditSellerForm';
import { useTranslation } from 'react-i18next';

interface ISellerEditionModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onSucceed: () => void;
  seller: any;
}
const SellerEditionModal: FC<ISellerEditionModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  seller,
  onSucceed
}) => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const { t } = useTranslation();
  useEffect(() => {
    getCountries();
  }, []);
  const getCountries = async () => {
    try {
      const countries = await requestService.getCountries();
      setCountries(countries.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <EmptyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography>{t('add_seller')}</Typography>
          <IconButton onClick={() => setIsModalOpen(false)}>
            <ClearOutlinedIcon />
          </IconButton>
        </Box>
        <EditSellerForm
          countries={countries}
          onSucceed={onSucceed}
          seller={seller}
        />
      </>
    </EmptyModal>
  );
};

export default SellerEditionModal;
