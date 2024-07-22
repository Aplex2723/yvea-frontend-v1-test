import { Box, CircularProgress } from '@mui/material';
import React from 'react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

export const AddBox = ({ onAdd, uploading = false, withBackground = true }) => {
  return (
    <>
      {withBackground ? (
        <Box
          bgcolor={'rgba(242, 239, 255, 1)'}
          borderRadius={'5px'}
          paddingX="16px"
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
        >
          <Box
            width="95px"
            height="95px"
            borderRadius={'10px'}
            sx={{
              border: '2px dashed rgba(27, 1, 155, 0.6)',
              cursor: 'pointer'
            }}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            onClick={onAdd}
          >
            {uploading ? <CircularProgress /> : <AddOutlinedIcon sx={{color:' rgba(27, 1, 155, 1)'}}/>}
          </Box>
        </Box>
      ) : (
        <Box
          width="95px"
          height="95px"
          borderRadius={'10px'}
          sx={{ border: '2px dashed rgba(27, 1, 155, 0.6)', cursor: 'pointer' }}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          onClick={onAdd}
        >
          {uploading ? <CircularProgress /> : <AddOutlinedIcon sx={{color:'rgba(27, 1, 155, 1)'}}/>}
        </Box>
      )}
    </>
  );
};
