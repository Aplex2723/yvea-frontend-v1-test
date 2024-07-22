import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { useSelector } from 'react-redux';
import { appState } from '@/store';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ICompanyForm } from '@/interfaces/account';
import { companyFormObjectSchema } from '@/form-schemas/accountSchemas';
import { KeyboardArrowDownRounded } from '@mui/icons-material';
import accountService from '@/services/account.service';
import showNotification from '@components/atoms/Notification';
import { useTranslation } from 'react-i18next';

const companyDefaultValues: ICompanyForm = {
  name: '',
  fiscalNumber: null,
  type: ''
};

const AccountContainer: FC = () => {
  /*
   hooks
  * */
  const [selectedTab, setSelectedTab] = React.useState('user');
  const [companyTypes, setCompanyTypes] = useState([]);
  const { email } = useSelector(({ users }: appState) => users);
  const { t } = useTranslation();

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setSelectedTab(newAlignment);
  };

  useEffect(() => {
    getCompanyTypes();
    getUserProfile();
  }, []);

  const {
    control: companyFormControl,
    handleSubmit,
    formState: { errors: companyErrors },
    setValue
  } = useForm<ICompanyForm>({
    defaultValues: companyDefaultValues,
    // @ts-ignore
    resolver: yupResolver(companyFormObjectSchema)
  });

  const getCompanyTypes = async () => {
    try {
      const response = await accountService.getCompanyTypes();

      if (response.status === 200 || response.status === 201) {
        setCompanyTypes(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getUserProfile = async () => {
    try {
      const response = await accountService.getUserProfile();
      if (response.status === 200 || response.status === 201) {
        setValue('name', response.data.company.name);
        setValue('fiscalNumber', response.data.company.fiscal_number);
        setValue('type', response.data.company.type);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const children = [
    <ToggleButton value="user" key="left" sx={{ borderRadius: '8px' }}>
      {t('user_information')}
    </ToggleButton>,
    <ToggleButton value="company" key="center" sx={{ borderRadius: '8px' }}>
      {t('enterprise_information')}
    </ToggleButton>
  ];

  const control = {
    value: selectedTab,
    onChange: handleChange,
    exclusive: true
  };

  const updateCompany = async (data: ICompanyForm) => {
    try {
      const payload = {
        email: email,
        company: {
          name: data.name,
          fiscal_number: data.fiscalNumber,
          type: data.type
        }
      };
      const response = await accountService.updateUser(payload);

      if (response.status === 200 || response.status === 201) {
        showNotification({
          type: 'success',
          message: t('your_account_is_modified'),
          timeout: 3000
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    /*container box*/
    <Box sx={{ width: '90%', margin: '0rem auto' }}>
      <Typography variant={'h4'} fontWeight={'bold'}>
        {t('account')}
      </Typography>
      <Stack spacing={2} alignItems="start" sx={{ mt: '2rem' }}>
        <ToggleButtonGroup
          {...control}
          color={'primary'}
          aria-label="Medium sizes"
        >
          {children}
        </ToggleButtonGroup>
      </Stack>
      {selectedTab === 'user' ? (
        <Box sx={{ mt: '2rem' }}>
          <Typography
            sx={{ color: 'text.secondary', fontSize: '14px', ml: '.1rem' }}
          >
            {t('email_address')}
          </Typography>
          <TextField disabled value={email} />
        </Box>
      ) : (
        /*enterprise form*/
        <Box sx={{ mt: '2rem' }}>
          <form onSubmit={handleSubmit(updateCompany)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: '14px',
                    ml: '.1rem'
                  }}
                >
                  {t('surname')}
                </Typography>
                <FormControl fullWidth>
                  <Controller
                    name={'name'}
                    control={companyFormControl}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        error={!!companyErrors?.name}
                        variant={'outlined'}
                        helperText={companyErrors?.name?.message}
                        sx={{ mt: '.5rem' }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: '14px',
                    ml: '.1rem'
                  }}
                >
                  {t('type_society')}
                </Typography>
                <FormControl fullWidth>
                  <Controller
                    name={'type'}
                    control={companyFormControl}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        fullWidth
                        value={value}
                        onChange={onChange}
                        variant={'outlined'}
                        sx={{ mt: '.5rem' }}
                        displayEmpty
                        IconComponent={KeyboardArrowDownRounded}
                      >
                        <MenuItem value="" disabled>
                          {t('choose')}
                        </MenuItem>
                        {companyTypes.map((type: any) => (
                          <MenuItem value={type.id} key={type.id}>
                            {t(type.name)}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: '14px',
                    ml: '.1rem'
                  }}
                >
                  {t('fiscal_number')}
                </Typography>
                <FormControl fullWidth>
                  <Controller
                    name={'fiscalNumber'}
                    control={companyFormControl}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value}
                        type={'number'}
                        error={!!companyErrors?.fiscalNumber}
                        onChange={onChange}
                        helperText={companyErrors?.fiscalNumber?.message}
                        variant={'outlined'}
                        sx={{ mt: '.5rem' }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Button variant={'contained'} type={'submit'} sx={{ mt: '3rem' }}>
              {t('validate_modification')}
            </Button>
          </form>
        </Box>
      )}
    </Box>
  );
};

export default AccountContainer;
