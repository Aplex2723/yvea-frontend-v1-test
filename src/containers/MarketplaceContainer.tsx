import { PartnerCarousel } from '@/components/PartnerCarousel';
import { Box, CircularProgress, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import partnerServices from '@/services/partners.service';
import { useAppDispatch } from '@/hooks/redux';
import { setCategories } from '@/store/marketplace/reducer';
import { useSelector } from 'react-redux';
import { appState } from '@/store';


export const MarketplaceContainer = () => {
  const { t, i18n } = useTranslation();  
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false)
  const { categories } = useSelector(({ marketplace }: appState) => marketplace);

  const getCategories = async () => {
    setLoading(true)
    const response = await partnerServices.getCategories()
    if(response.data){
      dispatch(setCategories(response.data as any))
      setLoading(false)
    }
  };

  useEffect(() => {
    getCategories()
  }, [])

  return (
    <Box sx={{ width: '90%', margin: '0rem auto' }} display={'flex'} flexDirection={'column'} gap='40px'>
      <Typography fontSize='29px' variant={'h4'} fontWeight={'bold'}>
        {t('marketplace')}
      </Typography>
      {loading? <Box
                alignItems={'center'}
                display={'flex'}
                justifyContent={'center'}
                height={'80vh'}
                width={'100%'}
              >
                <CircularProgress />
              </Box>:
      <Box display={'flex'} flexDirection={'column'} gap='32px'  marginBottom={5}>
        {categories.map(category=>{return <PartnerCarousel key={category.id} category={category} editMode={false} lang={i18n.language}/>})}
      </Box>}
    </Box>
  )
}
