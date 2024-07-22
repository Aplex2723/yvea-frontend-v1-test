export const MuiSelect = {
  styleOverrides: {
    select: {
      height: '20px',
      padding: '15px 15px',
      minHeight: '16px',
      '& .MuiOutlinedInput-root': {
        borderRadius: '16px'
      },
      '&.MuiOutlinedInput-input.Mui-disabled': {
        background: '#D0D5DD',
        color: '#667085d',
        borderRadius: '8px'
      },
      '& ~ .MuiSvgIcon-root': {
        position: 'absolute',
        right: 10,
        zIndex: 0
      },
      '& ~ fieldset.MuiOutlinedInput-notchedOutline': {
        borderRadius: '8px'
      }
    }
  }
};
