import React, { FC, useEffect, useState } from 'react';
import { EmptyModal } from '@components/EmptyModal';
import { Box, IconButton, Typography } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { ICountry } from '@/interfaces/common';
import requestService from '@/services/request.service';
import EditPlaceForm from '@components/EditPlaceForm';
import { useTranslation } from 'react-i18next';

interface IPlaceEditionModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onSucceed: () => void;
  place: any;
}
const PlaceEditorModal: FC<IPlaceEditionModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  place,
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
          <Typography>{t('add_inspection_location')}</Typography>
          <IconButton onClick={() => setIsModalOpen(false)}>
            <ClearOutlinedIcon />
          </IconButton>
        </Box>
        <EditPlaceForm
          countries={countries}
          onSucceed={onSucceed}
          place={place}
        />
      </>
    </EmptyModal>
  );
};

export default PlaceEditorModal;
