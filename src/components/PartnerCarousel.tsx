import { Box, Typography } from '@mui/material'
import React from 'react'
import { PartnerIcon } from './atoms/PartnerIcon'
import { Partner } from './Partner'
import { useTranslation } from 'react-i18next'
import { AddBox } from './atoms/AddBox'

interface category {
    id: string,
    name: string,
    partners: Array<any>
}


interface props {
  category:category,
  editMode?:boolean,
  handleAdd?:(categoryName:string)=>void
  handleEdit?:(id:string)=>void
  handleDelete?:(id:string)=>void
  lang:string
}

export const PartnerCarousel = ({category,editMode=false,handleAdd,handleEdit,handleDelete}:props) => {  
  const { t } = useTranslation();  

    const onAdd = () => {
      handleAdd(category.name)
    };
    const onEdit = (id:string) => {
      handleEdit(id)
    };
    const onDelete = (id:string) => {
      handleDelete(id)
    };

  return (
    <Box display='flex' flexDirection='column' gap='16px'>
        <Box bgcolor='rgba(127, 85, 217, 0.1)' borderRadius={'8px'} padding='8px' display={'flex'} gap='8px' alignItems={'center'}>
            <PartnerIcon categoryId={category?.id}/>
            <Typography color={'rgba(27, 1, 155, 1)'} fontWeight={500}>{t(category?.id)}</Typography>
        </Box>
        <Box display={'flex'} gap={'40px'} height={editMode && '304px'}>
          {editMode && <AddBox onAdd={onAdd}/>} 
          <Box className='hidden-scrollbar' display={'flex'} gap={'40px'}  sx={{overflowY:'hidden !important'}}>
            {category.partners.map(partner=>{
              return <Box key={partner.id} display={'flex'} gap={4}>
              <Partner partner={partner} editMode={editMode} handleEdit={onEdit} handleDelete={onDelete}/>
            </Box>
            })}
          </Box>
        </Box>
    </Box>
  )
}
