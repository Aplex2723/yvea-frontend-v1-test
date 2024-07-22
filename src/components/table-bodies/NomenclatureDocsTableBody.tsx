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
export const NomenclatureDocsTableBody: FC<Props> = ({ data = [] }) => {
  const { t } = useTranslation();

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
      <Box display={'flex'} alignItems={'center'}>
        <CreditCardIcon sx={{ ml: '.5rem', mr: '1rem' }} />
        {t('letter_of_credit')}
      </Box>
    )
  };

  return (
    <TableBody>
      {data?.map((nomemclature, index) => (
        <TableRow key={index} sx={{ 'td, th': { border: 0 } }}>
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              sx={{ borderBottom: '1px solid #EAECF0', height: '3.5rem' }}
              id="panel1a-header"
            >
              <Typography sx={{ ml: '1rem' }}>{nomemclature?.code}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {nomemclature?.products?.length &&
                nomemclature?.products?.map((product, index) => (
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
                            sx={{ ml: '10rem', mr: '3rem', fontSize: '14px' }}
                          />
                          <Typography variant={'body2'} sx={{ mr: '1rem' }}>
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
                                  {ICONS[document?.type] ?? ''}
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
                ))}
            </AccordionDetails>
          </Accordion>
        </TableRow>
      ))}
    </TableBody>
  );
};
