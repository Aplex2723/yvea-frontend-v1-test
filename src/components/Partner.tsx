import { Box, Divider, Typography } from '@mui/material'
import Image from 'next/image'
import React, { useState } from 'react'
import { IPartner } from '@/interfaces/partners'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { imageCdn } from '../../utils/common'

interface props {
  partner:IPartner,
  editMode?:boolean,
  handleEdit?:(id:string)=>void,
  handleDelete?:(id:string)=>void,
}

export const Partner = ({partner,editMode=false,handleEdit,handleDelete}:props) => {
    const [hovered, setHovered] = useState<boolean>(false)
    const {t} = useTranslation()
    const router = useRouter()

    const handleClick = () => {
      const siteUrl = (partner.site_url.includes('https://')||partner.site_url.includes('http://'))? partner.site_url: `https://${partner.site_url}`
      router.push(siteUrl)
    };

    const onEdit = () => {
      handleEdit(partner.id)
    };

    const onDelete = () => {      
      handleDelete(partner.id)
    };    

  return (
    <Box height={editMode?'304px':hovered?'262px':'95px'} width='153px' sx={{transition:'height 0.5s ease-in-out'}} overflow={(!hovered && !editMode) && 'hidden'} onMouseLeave={()=>{setHovered(false)}}>
       <Box position={'relative'}>
            {partner.logo_url && partner.logo_url.includes('yvea-images') && <Image onMouseEnter={()=>{setHovered(true)}} src={imageCdn(partner.logo_url)} alt='partner' height={87} width={100} style={{objectFit:'cover', opacity:editMode || hovered?1:0.6, transform:(editMode || hovered) && 'translateY(10px)'}}/>}
            {(editMode || hovered) && partner?.percentage && <Box position='absolute' right={40} top={0} width={'34px'} height={'25px'} bgcolor={'rgba(178, 255, 181, 1)'} sx={{borderRadius:'5px', borderBottomLeftRadius:'0px', boxShadow:'0px 4px 4px 0px rgba(0, 0, 0, 0.25)'}} display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <Typography fontSize={'10px'} fontWeight={700} color={'rgba(0, 99, 4, 1)'} textAlign={'center'}>
                {partner.percentage}%
              </Typography>
            </Box>}
        </Box> 
       <Box height='117px' sx={{opacity:editMode || hovered?1:0, transition:'opacity 0.3s ease-in-out'}}>        
            <Typography fontSize={16} fontWeight={600} color={'rgba(27, 1, 155, 1)'} sx={{transform:(editMode || hovered) && 'translateY(5px)', transition:'translateY 0.3s ease-in-out'}}>{partner.name}</Typography>
            <Box position={'relative'} marginY={'7px'}>
                <Divider sx={{backgroundColor:'rgba(127, 85, 217, 1)',height:'1px'}}/>
                <div style={{position:'absolute', width: '5px', height: '5px', backgroundColor: 'rgba(127, 85, 217, 1)', borderRadius: '50%', right:0,top:-2}}></div>
            </Box>
            <Typography color='rgba(95, 95, 95, 1)' fontSize={16} fontWeight={400}>{partner.description}</Typography>
            <Box className='visit-button' marginTop={'16px'} border='1px solid rgba(27, 1, 155, 1)' display={'inline-flex'} padding={'5px 10px'} borderRadius={'2px'} sx={{cursor:'pointer'}} onClick={handleClick}>
                <Typography textAlign={'center'} color='rgba(27, 1, 155, 1)' fontSize={14}>{t('visit_site')}</Typography>
            </Box>                        
            {editMode &&
            <Box marginY='1rem'>
            <Divider sx={{border:'1px solid rgba(208, 208, 208, 1)'}}/>
            <Box marginTop={'0.2rem'} display={'flex'} justifyContent={'end'} gap={1}>              
              <Typography onClick={()=>onEdit()} fontWeight={600} fontSize={10} textTransform={'uppercase'} sx={{cursor:'pointer'}}>{t('edit')}</Typography>
              <Typography onClick={()=>onDelete()} fontWeight={600} fontSize={10} textTransform={'uppercase'} sx={{cursor:'pointer'}} color='rgba(248, 24, 24, 1)'>{t('delete')}</Typography>
            </Box>
            </Box> 
            } 
        </Box>
    </Box>
  )
}
