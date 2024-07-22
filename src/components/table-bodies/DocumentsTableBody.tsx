import { Header } from '@components/GenericDataTable';
import {
  TableBody,
  TableRow,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import React, { FC } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import FolderSpecialOutlinedIcon from '@mui/icons-material/FolderSpecialOutlined';
import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import BiotechOutlinedIcon from '@mui/icons-material/BiotechOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useTranslation } from 'react-i18next';

import getConfig from 'next/config';
type Props = {
  data: any[];
  headers: Header[];
};

const { publicRuntimeConfig } = getConfig();

//
export const DocumentsTableBody: FC<Props> = ({ data = [] }) => {
  const { t } = useTranslation();
  // console.log(data);
  // const downloadFile = async (key: string) => {
  //   try {
  //     const response = await userPanelService.getDocumentUrl(key);
  //     if (response.status === 200) {
  //       console.log(response.data);
  //       // window.open(response, '_blank');
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  const ICONS = {
    QUALITY_CERTIFICATE: (
      <Box display={'flex'} alignItems={'center'}>
        <FolderSpecialOutlinedIcon sx={{ ml: '.5rem', mr: '1rem' }} />
        {t('quality_certificade')}
      </Box>
    ),
    INVOICE: (
      <Box display={'flex'} alignItems={'center'}>
        <ReceiptOutlinedIcon sx={{ ml: '.5rem', mr: '1rem' }} />
        {t('invoice')}
      </Box>
    ),
    IMPORT_DECLARATION_FORM: (
      <Box display={'flex'} alignItems={'center'}>
        <Inventory2OutlinedIcon sx={{ ml: '.5rem', mr: '1rem' }} />

        {t('import_declaration')}
      </Box>
    ),
    GOEIC_REGISTRATION: (
      <Box display={'flex'} alignItems={'center'}>
        {t('another_document')}
      </Box>
    ),
    TEST_REPORT_OR_ANALYSIS_CERTIFICATE: (
      <Box display={'flex'} alignItems={'center'}>
        <AnalyticsOutlinedIcon sx={{ ml: '.5rem', mr: '1rem' }} />

        {t('test_report')}
      </Box>
    ),
    TECHNICAL_SHEET_OR_PRODUCT_DESCRIPTIVE: (
      <Box display={'flex'} alignItems={'center'}>
        <BiotechOutlinedIcon sx={{ ml: '.5rem', mr: '1rem' }} />
        {t('sheet_technical')}
      </Box>
    ),
    LETTER_OF_CREDIT: (
      <Box display={'flex'} alignItems={'left'}>
        <CreditCardIcon sx={{ ml: '.5rem', mr: '1rem' }} />
        {t('letter_of_credit')}
      </Box>
    )
  };

  return (
    <TableBody>
      {data?.map((field, index) => (
        <TableRow key={index} sx={{ 'td, th': { border: 0 } }}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              sx={{ borderBottom: '1px solid #EAECF0' }}
              id="panel1a-header"
            >
              <Typography paddingLeft={'1rem'}>{field.title}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ paddingX: '0rem', paddingY: '0rem' }}>
              {field?.documents?.length &&
                field?.documents?.map((document, index) => (
                  <Box
                    display={'flex'}
                    padding={'1rem'}
                    borderBottom={'1px solid #EAECF0'}
                    height={'3.5rem'}
                    justifyContent={'space-between'}
                    key={index}
                    sx={{ 'td, th': { border: 0 } }}
                  >
                    <Box component={'span'} display={'flex'}>
                      <EastOutlinedIcon
                        sx={{ ml: '7rem', mr: '3rem', fontSize: '14px' }}
                      />
                      <Typography variant={'body2'} sx={{ mr: '1rem' }}>
                        {document.key.slice(-6)}
                      </Typography>
                      {ICONS[document.type] ?? ''}
                    </Box>
                    <a
                      href={`${publicRuntimeConfig.API_URL}storage/signed-url/${document?.key}`}
                      rel="noreferrer"
                      target={'_blank'}
                    >
                      <IconButton>
                        <SaveAltIcon />
                      </IconButton>
                    </a>
                  </Box>
                ))}
              {field?.nomenclature_codes?.length &&
                field?.nomenclature_codes?.map((nomclature, index) => (
                  <Accordion key={index}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      sx={{
                        borderBottom: '1px solid #EAECF0',
                        height: '3.5rem'
                      }}
                      id="panel1a-header"
                    >
                      <EastOutlinedIcon
                        sx={{ ml: '12rem', mr: '3rem', fontSize: '14px' }}
                      />
                      <Typography sx={{ ml: '2rem' }}>
                        {nomclature?.code}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{padding:0}}>
                      {nomclature?.products?.length &&
                        nomclature?.products?.map((product, index) => (
                          <>
                            <Accordion key={index}>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                sx={{
                                  borderBottom: '1px solid #EAECF0',
                                  height: '3.5rem'
                                }}
                                id="panel1a-header"
                              >
                                <Box
                                  display={'flex'}
                                  padding={'1rem'}                                  
                                  height={'3.5rem'}
                                  justifyContent={'space-between'}
                                  key={index}
                                  sx={{ 'td, th': { border: 0 } }}
                                >
                                  <Box component={'span'} display={'flex'}>
                                    <EastOutlinedIcon
                                      sx={{
                                        ml: '18rem',
                                        mr: '3rem',
                                        fontSize: '14px'
                                      }}
                                    />
                                    <Typography
                                      variant={'body2'}
                                      sx={{ mr: '1rem' }}
                                    >
                                      {product?.name ?? 'No name'}
                                    </Typography>
                                  </Box>
                                </Box>
                              </AccordionSummary>
                              <AccordionDetails sx={{padding:0}}>
                                {product.documents.map(document => {
                                  return (
                                    <Box
                                      display={'flex'}
                                      padding={'1rem'}
                                      paddingLeft="26rem"
                                      borderBottom={'1px solid #EAECF0'}
                                      height={'3.5rem'}
                                      justifyContent={'space-between'}
                                      key={document.key}
                                      sx={{ 'td, th': { border: 0 } }}
                                      width='100%'
                                    >       
                                    <Box display={'flex'} flexDirection={'row'}>
                                      <EastOutlinedIcon
                                        sx={{                                          
                                          mr: '3rem',
                                          fontSize: '14px'
                                        }}
                                      />
                                        <Typography
                                          variant={'body2'}
                                          sx={{ mr: '1rem' }}
                                        >
                                          {ICONS[document?.type]}
                                        </Typography>
                                      </Box>                               
                                        <a
                                          href={`${publicRuntimeConfig.API_URL}storage/signed-url/${document.key}`}
                                          rel="noreferrer"
                                          target={'_blank'}
                                        >
                                          <IconButton>
                                            <SaveAltIcon />
                                          </IconButton>
                                        </a>                                      
                                    </Box>
                                  );
                                })}
                              </AccordionDetails>
                            </Accordion>
                          </>
                        ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
            </AccordionDetails>
          </Accordion>
        </TableRow>
      ))}
    </TableBody>
  );
};
