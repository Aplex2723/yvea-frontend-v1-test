import React from 'react';
import { NextPage } from 'next';
import {
  Box, Typography
} from '@mui/material';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';

const ComingSoonContainer: NextPage = () => {

  return (
    <Box padding={'2rem'} sx={{ minHeight: '100vh' }}>
      <Box
        sx={{
          width: { md: '100%', lg: '80%' },
          paddingTop: '2rem',
          display:'flex',
          flexDirection:'column',
          justifyContent:'center',
          alignItems:'center',
          height: '80vh',
          margin: 'auto'
        }}
      >
        <CardGiftcardOutlinedIcon sx={{color:'secondary.main', fontSize:'4rem'}}/>
        <Typography sx={{fontSize:'1.8rem', fontWeight:'bold'}}>Coming Soon</Typography>
      </Box>
    </Box>
  );
};

export default ComingSoonContainer;
