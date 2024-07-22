import React, { useState } from 'react';
import { Box, Button, TextField, Typography, styled } from '@mui/material';
import { EmptyModal } from '../EmptyModal';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { faqsSchema } from '@/form-schemas/faqsSchema';
import assistantServices from '@/services/assistant.service';
import showNotification from './Notification';
import { useTranslation } from 'react-i18next';

const ConfirmationModalContainer = styled(Box)((_) => ({
  height: '16rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}));

export const Assistant: React.FC<any> = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { t } = useTranslation();

  const {
    control: faqsControl,
    handleSubmit,
    getValues,
    formState: { errors: faqsErrors }
  } = useForm<any>({
    defaultValues: { question: '' },
    // @ts-ignore
    resolver: yupResolver(faqsSchema)
  });

  const sendQuestion = async () => {
    const body = getValues();

    const payload = {
      body: body?.question
    };

    try {
      const response = await assistantServices.sendQuestion(payload);

      if (response.status === 201) {
        showNotification({
          type: 'success',
          message: 'question_send_success',
          timeout: 2000
        });
        await setShowModal(false);
      }
    } catch (e) {
      if (
        e.response.status === 400 ||
        e.response.status === 404 ||
        e.response.status === 401
      ) {
        showNotification({
          type: 'error',
          message: e?.response?.data?.message?.[0],
          timeout: 2000
        });
      }
    }
  };

  return (
    <>
      <Box
        borderRadius={'50%'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        width={'50px'}
        height={'50px'}
        sx={{ cursor: 'pointer' }}
        bgcolor={'secondary.500'}
        position={'fixed'}
        top={'0.5%'}
        right={'1%'}
        zIndex={'1300'}
        onClick={() => setShowModal(true)}
      >
        <QuestionMarkIcon
          sx={{
            color: 'background.paper',

            fontSize: '30px'
          }}
        />
      </Box>
      <EmptyModal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ConfirmationModalContainer>
          <form
            className="flex flex-col items-center w-[324px] mx-1"
            onSubmit={handleSubmit(sendQuestion)}
          >
            <Box sx={{ width: '100%', paddingX: '3rem' }}>
              <Typography
                variant={'body2'}
                sx={{
                  textAlign: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  mb: '1rem',
                  color: 'success.main'
                }}
              >
                {t('tell_us_question')}
              </Typography>

              <Controller
                name={'question'}
                control={faqsControl}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    onChange={onChange}
                    placeholder="question"
                    sx={{ width: '100%', marginBottom: '1rem' }}
                    multiline
                    rows={4}
                    inputProps={{ maxLength: 255 }}
                    InputProps={{
                      style: {
                        paddingBottom: '30px',
                        paddingRight: '7px',
                        paddingTop: '5px'
                      },
                      endAdornment: (
                        <Box
                          display={'flex'}
                          position={'absolute'}
                          bottom={'0.5rem'}
                          right={0}
                          marginRight={'1rem'}
                        >
                          <Typography fontSize={'12px'} fontWeight={'500'}>
                            {value?.length}
                          </Typography>
                          <Typography fontSize={'12px'} fontWeight={'500'}>
                            {`/${255}`}
                          </Typography>
                        </Box>
                      )
                    }}
                    error={!!faqsErrors.question}
                  />
                )}
              />

              <Button
                variant={'contained'}
                type="submit"
                // onClick={() => {
                //   setShowModal(false);
                // }}
                sx={{
                  width: '100%',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              >
                {t('send')}
              </Button>
            </Box>
          </form>
        </ConfirmationModalContainer>
      </EmptyModal>
    </>
  );
};
