import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import { SaveButton } from './atoms/SaveButton';
import { Controller, useForm } from 'react-hook-form';
import { IPartnerForm, partnerSchema } from '@/form-schemas/partnerSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddBox } from './atoms/AddBox';
import Image from 'next/image';
import { generateImageUrl, getToken } from '../../utils/imagesService';
import { fetchData, imageCdn } from '../../utils/common';
import partnerServices from '@/services/partners.service';
import { MarketplaceCategory } from '@/interfaces/enums';
import { useSelector } from 'react-redux';
import { appState } from '@/store';
import { useAppDispatch } from '@/hooks/redux';
import { setCategories } from '@/store/marketplace/reducer';
import { NumericFormat } from 'react-number-format';

interface ManagePartnerModalProps {
  isOpen: boolean;
  closingAction: () => void;
  id?: string;
  editMode?: boolean;
  category?: MarketplaceCategory;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 372,
  height:'90%',
  borderRadius: '16px',
  backgroundColor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflowY:'scroll'
};

export const ManagePartnerModal: React.FC<ManagePartnerModalProps> = ({
  isOpen,
  closingAction,
  id,
  editMode = false,
  category
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const inputRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(editMode);
  const [submiting, setSubmiting] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>(''); //bucket    
  const { categories: categoryOptions } = useSelector(
    ({ marketplace }: appState) => marketplace
  );

  const defaultPartnerValues = {
    logo_url: '',
    company_name: '',
    company_description: '',
    site_url: '',
    discount: undefined,
    categories: []
  };

  const {
    reset: partnerReset,
    control: partnerControl,
    handleSubmit: handlePartnerSubmit,
    getValues,
    setValue,    
    clearErrors,
    formState: { errors: partnerErrors }
  } = useForm<IPartnerForm>({
    defaultValues: defaultPartnerValues,
    // @ts-ignore
    resolver: yupResolver(partnerSchema)
  });

  const fillData = (data) => {
    setImageUrl(data.logo_url);
    setValue('logo_url', data.logo_url);
    setValue('company_name', data.name);
    setValue('company_description', data.description);
    setValue('site_url', data.site_url);
    if(data.percentage) setValue('discount', data.percentage * -1);
    setValue('categories', data.categories.map(cat=>cat.id))
  };

  const getPartnerData = () => {
    fetchData(partnerServices.getPartner, fillData, 'getPartner', id, null);
    setLoading(false);
  };

  const handleSubmit = async () => {
    setSubmiting(true);
    const values = getValues();
    const payload = {
      name: values.company_name,
      description: values.company_description,
      logoUrl: imageUrl,
      siteUrl: values.site_url,
      percentage: values.discount * -1,
      categories: values.categories
    };
    if(isNaN(payload.percentage)) delete payload['percentage']
    const submitMethod = editMode? partnerServices.updatePartner(id,payload):partnerServices.createPartner(payload)
    const response = await submitMethod;
    setSubmiting(false);
    if (response.data) {
      const categoriesResponse = await partnerServices.getCategories()
      if(categoriesResponse.data){
        dispatch(setCategories(categoriesResponse.data as any))
      }
      closingAction();
    }
  };

  useEffect(() => {
    if (id) {
      getPartnerData();
    }else{
      if(category) setValue('categories',[category])
    } 
  }, [id,category]);

  useEffect(() => {
    setSubmiting(false);
    if (!isOpen) {
      partnerReset();
      setImageUrl('');
    }
  }, [isOpen]);

  const handleAddClick = () => {
    inputRef.current.click();
  };

  const getBucketUrl = async (file) => {
    try {
      const token = await getToken();

      const resp = await generateImageUrl(file, token);

      if (resp.status === 202) {
        return resp.data.will_upload_to.key;
      } else {
        return '';
      }
    } catch (e) {
      console.log(e);
      return '';
    }
  };

  const renderImage = () => {
    const {logo_url} = getValues()  
    if(logo_url.includes('blob')){
      return logo_url
    }else{
      return imageCdn(logo_url)
    }
  };

  const handleDiscountChange = (value) => {        
    clearErrors('discount')
    setValue('discount', value===""?null: value)        
  };

  return (
    <Modal
      open={isOpen}
      onClose={closingAction}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"      
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'transparent'
        }        
      }}
    >
      <Box className='hidden-scrollbar' sx={style}>
        {loading ? (
          <Box display={'flex'} justifyContent={'center'}>
            <CircularProgress />
          </Box>
        ) : (
          <form>
            <Box
              display={'flex'}
              flexDirection={'column'}
              gap="14px"
              alignItems={'center'}
            >
              <Box
                bgcolor="rgba(127, 85, 217, 0.1)"
                borderRadius={'8px'}
                padding="8px"
                display={'flex'}
                gap="8px"
                alignItems={'center'}
                width="100%"
              >
                <Box
                  width="24px"
                  height="24px"
                  borderRadius="4px"
                  bgcolor={'rgba(226, 220, 255, 1)'}
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <AddReactionOutlinedIcon
                    sx={{ width: '16px', height: '16px' }}
                  />
                </Box>
                <Typography
                  color={'rgba(27, 1, 155, 1)'}
                  fontSize={18}
                  fontWeight={700}
                >
                  {t(editMode ? 'edit_company' : 'add_new_company')}
                </Typography>
              </Box>
              <Controller
                name="logo_url"
                control={partnerControl}
                rules={{ required: true }}
                render={() => (
                  <Box width="100%">
                    <Typography
                      color={'rgba(27, 1, 155, 1)'}
                      fontWeight={600}
                      marginBottom={1.5}
                    >
                      {t('upload_logo')}
                    </Typography>
                    <Box>
                      {imageUrl ? (
                        <Box
                          width="95px"
                          height="95px"
                          borderRadius={'10px'}
                          sx={{
                            border: 'none',
                            cursor: 'pointer'                            
                          }}
                          display={'flex'}
                          justifyContent={'center'}
                          alignItems={'center'}
                          onClick={handleAddClick}                          
                        >
                          <Image
                            src={renderImage()}
                            alt="profile image"
                            width={95}
                            height={95}
                            style={{ borderRadius: 10, objectFit: 'cover' }}
                            unoptimized={false}                          
                          />                                               
                        </Box>
                      ) : (
                        <AddBox
                          onAdd={handleAddClick}
                          uploading={uploading}
                          withBackground={false}
                        />
                      )}
                      <input
                        id="partner-logo"
                        className="profile-input"
                        type="file"
                        style={{ display: 'none' }}
                        ref={inputRef}
                        accept=".jpg, .jpeg, .png"
                        onChange={async (e) => {
                          setUploading(true);
                          if (e.target.files.length === 0) return;
                          const imageUrl = await getBucketUrl(
                            e.target.files[0]
                          );
                          setImageUrl(imageUrl);
                          const objectUrl = URL.createObjectURL(
                            e.target.files[0]
                          );
                          setValue('logo_url', objectUrl);
                          setUploading(false);
                        }}
                      />
                      {partnerErrors?.logo_url?.message && (
                        <Typography
                          color="#D92D20"
                          fontSize={'0.75rem'}
                          marginLeft="14px"
                          marginTop="3px"
                        >
                          {t(partnerErrors?.logo_url?.message, {
                            field: 'Logo'
                          })}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              />
              <Controller
                name="company_name"
                control={partnerControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Box width="100%">
                    <Typography color={'rgba(27, 1, 155, 1)'} fontWeight={600}>
                      {t('company_name')}
                    </Typography>
                    <TextField
                      placeholder={t('company_name')}
                      value={value}
                      onChange={onChange}
                      error={!!partnerErrors.company_name}
                      margin="normal"
                      fullWidth
                      helperText={
                        t(partnerErrors?.company_name?.message, {
                          field: t('company_name')
                        }) ?? ''
                      }
                    />
                  </Box>
                )}
              />
              <Controller
                name="company_description"
                control={partnerControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Box width="100%">
                    <Typography color={'rgba(27, 1, 155, 1)'} fontWeight={600}>
                      {t('company_description')}
                    </Typography>
                    <TextField
                      placeholder={t('company_description')}
                      value={value}
                      onChange={onChange}
                      error={!!partnerErrors.company_description}
                      margin="normal"
                      fullWidth
                      multiline
                      minRows={2}
                      sx={{
                        textarea: {
                          padding: '0px !important'
                        }
                      }}
                      helperText={
                        t(partnerErrors?.company_description?.message, {
                          field: t('company_description')
                        }) ?? ''
                      }
                    />
                  </Box>
                )}
              />
              <Controller
                name="site_url"
                control={partnerControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Box width="100%">
                    <Typography color={'rgba(27, 1, 155, 1)'} fontWeight={600}>
                      {t('url_site')}
                    </Typography>
                    <TextField
                      placeholder={t('www.example.com')}
                      value={value}
                      onChange={onChange}
                      error={!!partnerErrors.site_url}
                      margin="normal"
                      fullWidth
                      helperText={
                        t(partnerErrors?.site_url?.message, {
                          field: t('url_site')
                        }) ?? ''
                      }
                    />
                  </Box>
                )}
              />
              <Controller
                name="discount"
                control={partnerControl}
                rules={{ required: true }}
                render={({ field: { value } }) => (
                  <Box width="100%">
                    <Typography color={'rgba(27, 1, 155, 1)'} fontWeight={600}>
                      {t('discount_optional')}
                    </Typography>
                    <TextField
                      value={value}
                      onChange={(e)=>handleDiscountChange(e.target.value)}
                      error={!!partnerErrors.discount}
                      margin="normal"
                      fullWidth
                      InputProps={{
                        inputComponent: NumberFormatCustom as any,                        
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        )                                                   
                      }}                      
                      helperText={
                        t(partnerErrors?.discount?.message, {
                          field: t('discount')
                        }) ?? ''
                      }
                    />
                  </Box>
                )}
              />
              <Controller
                name="categories"
                control={partnerControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Box width="100%">
                    <Typography color={'rgba(27, 1, 155, 1)'} fontWeight={600}>
                      {t('categories')}
                    </Typography>
                    <Select                      
                      id="multiple-chip"
                      multiple
                      value={value}
                      onChange={onChange}
                      sx={{width:'100%', minHeight:'3rem'}}
                      input={<OutlinedInput />}                                     
                    >
                      {categoryOptions.map((option) => (
                        <MenuItem
                          key={option.id}
                          value={option.id}                          
                        >
                          {t(option.id)}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                )}
              />
              <SaveButton
                onClick={handlePartnerSubmit(handleSubmit)}
                type="submit"
                disabled={submiting}
              />
            </Box>
          </form>
        )}
      </Box>
    </Modal>
  );
};

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props) {
  const { ...other } = props;
  return (
    <NumericFormat
      {...other}
      type="text"
      decimalSeparator=","
      decimalScale={2}
      allowNegative={false}
      isAllowed={(values) => {        
        const { floatValue } = values;
        return floatValue < 99.99 || floatValue===undefined;
      }}      
    />
  );
});
