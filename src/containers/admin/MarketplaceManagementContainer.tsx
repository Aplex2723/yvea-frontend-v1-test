import { DeleteAlertModal } from '@/components/DeleteAlertModal';
import { ManagePartnerModal } from '@/components/ManagePartnerModal';
import { PartnerCarousel } from '@/components/PartnerCarousel';
import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import partnerServices from '@/services/partners.service';
import { MarketplaceCategory } from '@/interfaces/enums';
import { useSelector } from 'react-redux';
import { appState } from '@/store';
import { useAppDispatch } from '@/hooks/redux';
import { setCategories } from '@/store/marketplace/reducer';

export const MarketplaceManagementContainer = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const [showManagePartnerModal, setShowManagePartnerModal] = useState<boolean>(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false)
  const [selectedPartnerId,setSelectedPartnerId] = useState<string>('')
  const [selectedCategory,setSelectedCategory] = useState<MarketplaceCategory>(null)
  const { categories } = useSelector(({ marketplace }: appState) => marketplace);
  const [loading, setLoading] = useState<boolean>(false)

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
  
  const onAdd = (categoryId) => {
    setSelectedPartnerId('')
    setSelectedCategory(categoryId) 
    setShowManagePartnerModal(true)
  };
  const onEdit = (id:string) => {     
    setSelectedPartnerId(id)
    setShowManagePartnerModal(true)
  };
  const handleManagePartnerModalClose = () => {
    setShowManagePartnerModal(false)
    setSelectedPartnerId('')
    setSelectedCategory(null)
  };
  const onDelete = (id:string) => {      
    setSelectedPartnerId(id)
    setShowDeleteAlert(true)
  };
  const confirmDelete = async () => {
    await partnerServices.deletePartner(selectedPartnerId)
    const categoriesResponse = await partnerServices.getCategories()
      if(categoriesResponse.data){
        dispatch(setCategories(categoriesResponse.data as any))
      }
    setShowDeleteAlert(false)
  };

  const handleAlertClose = () => {
    setShowDeleteAlert(false)
    setSelectedPartnerId('')
  };

  return (
    <Box sx={{ width: '90%', margin: '0rem auto' }} display={'flex'} flexDirection={'column'} gap='40px'>
      <Typography variant={'h4'} fontWeight={'bold'}>
        {t('marketplace')}
      </Typography>
      {loading ? <Box
                alignItems={'center'}
                display={'flex'}
                justifyContent={'center'}
                height={'80vh'}
                width={'100%'}
              >
                <CircularProgress />
              </Box>:
      <Box display={'flex'} flexDirection={'column'} gap='32px' marginBottom={5}>
        {categories.map(category=>{return <PartnerCarousel key={category.id} category={category} editMode={true} lang={i18n.language} handleAdd={()=>onAdd(category.id)} handleEdit={onEdit} handleDelete={onDelete}/>})}
      </Box>}
      <DeleteAlertModal
        isOpen={showDeleteAlert}
        closingAction={handleAlertClose}
        confirmAction={confirmDelete}
      />
      {selectedPartnerId && <ManagePartnerModal
       isOpen={showManagePartnerModal}
       closingAction={handleManagePartnerModalClose}
       id={selectedPartnerId} 
       editMode             
      />}
      {!selectedPartnerId && <ManagePartnerModal
       isOpen={showManagePartnerModal}
       closingAction={handleManagePartnerModalClose}
       id={selectedPartnerId}
       category={selectedCategory}             
      />}
    </Box>
  )
}
