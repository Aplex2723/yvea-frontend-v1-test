import { Box, Button, styled } from '@mui/material';

export const AlertDot = styled(Box)((theme) => ({
  height:'2.6rem',
  borderRadius:'100%',
  background: theme.theme.palette.success['200'],
  marginBottom:'1.5rem',
  display:'flex',
  justifyContent:'center',
  alignItems:'center',
  width:'2.6rem'
}));

export const RevenirButtom = styled(Button)((theme) => ({
  width:'100%',
  color: theme.theme.palette.text.secondary,
  textDecoration:'underline',
  textTransform:'none',
  borderRadius:'8px',
  marginBottom:'1rem'
}));