import { Button } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next';

export const SaveButton = ({...props}:any) => {
    const { t } = useTranslation();  
    return (
        <Button sx={{backgroundColor:'rgba(127, 85, 217, 1)',borderRadius:'8px', padding:'8px', color:'white', width:'100%', fontSize:'16px', fontWeight:'600', textTransform:'capitalize'}} {...props}>
            {t('save')}
        </Button>
    )
}
