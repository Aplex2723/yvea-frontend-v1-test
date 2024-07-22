export const MuiTextField = {
  styleOverrides: {
    root: () => ({
      minWidth: '70px',
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px'
      },
      '& .MuiOutlinedInput-root .MuiOutlinedInput-input': {
        padding: '10px 15px',
        height: '30px'
      },
      '& .MuiInputBase-input.Mui-disabled': {
        WebkitTextFillColor: '#667085',
        backgroundColor: '#D0D5DD',
        borderRadius: '8px'
      }
    })
  }
};
