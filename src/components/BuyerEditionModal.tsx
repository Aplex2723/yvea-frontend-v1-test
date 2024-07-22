import React, { FC, useEffect, useState } from 'react';
import { EmptyModal } from '@components/EmptyModal';
import { Box, IconButton, Typography } from '@mui/material';
import BuyerForm from '@components/EditBuyerForm';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { ICountry } from '@/interfaces/common';
import requestService from '@/services/request.service';
import { useTranslation } from 'react-i18next';

interface IBuyerEditionModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onSucceed: () => void;
  buyer: any;
}
const BuyerEditionModal: FC<IBuyerEditionModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  buyer,
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
          <Typography>{t('add_buyer')}</Typography>
          <IconButton onClick={() => setIsModalOpen(false)}>
            <ClearOutlinedIcon />
          </IconButton>
        </Box>
        <BuyerForm countries={countries} onSucceed={onSucceed} buyer={buyer} />
      </>
    </EmptyModal>
  );
};

export default BuyerEditionModal;
