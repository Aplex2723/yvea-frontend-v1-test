import { Box } from '@mui/material'
import React from 'react'
import CertificationsAndTests from '@/public/icons/marketplace/CertificationsAndTests.svg';
import ComplianceAndQuality from '@/public/icons/marketplace/ComplianceAndQuality.svg';
import LogisticsAndTransportation from '@/public/icons/marketplace/LogisticsAndTransportation.svg';
import FinanceAndLegal from '@/public/icons/marketplace/FinanceAndLegal.svg';
import MarketExpansion from '@/public/icons/marketplace/MarketExpansion.svg';
import EducationAndTraining from '@/public/icons/marketplace/EducationAndTraining.svg';
import DigitalSolutions from '@/public/icons/marketplace/DigitalSolutions.svg';
import Image from 'next/image';

export const PartnerIcon = ({categoryId}:{categoryId:string}) => {

  const iconsMap: { [key: string]: string } = {
    "CERTIFICATIONS_TESTS": CertificationsAndTests,
    "FINANCE_LEGAL": FinanceAndLegal,
    "LOGISTICS_TRANSPORTATION": LogisticsAndTransportation,
    "COMPLIANCE_QUALITY": ComplianceAndQuality,
    "MARKET_EXPANSION": MarketExpansion,
    "EDUCATION_TRAINING": EducationAndTraining,
    "DIGITAL_SOLUTIONS": DigitalSolutions,
  };  

  return (
    <Box width='24px' height='24px' borderRadius='4px' bgcolor={'rgba(226, 220, 255, 1)'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <Image src={iconsMap[categoryId]} alt={categoryId}/>        
    </Box>
  )
}
