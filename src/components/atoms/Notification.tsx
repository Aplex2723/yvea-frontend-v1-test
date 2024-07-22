import React from 'react';
import { createRoot } from 'react-dom/client';

import { Alert, Box, Snackbar } from '@mui/material';

type MessageType = 'success' | 'error' | 'warning' | 'info';

interface NotifyProps {
  type: MessageType;
  message: string | string[];
  timeout?: number;
}

const showNotification = ({ type, message, timeout = 5000 }: NotifyProps) => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const root = createRoot(container);

  root.render(
    <Box
      display={'flex'}
      flexDirection={'column'}
      flexWrap={'wrap'}
      gap={'1em'}
      position={'fixed'}
      zIndex={1500}
      bottom={0}
      left={10}
    >
      <>
        {Array.isArray(message) ? (
          message.map((message) => (
            <Snackbar
              key={message}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              autoHideDuration={timeout}
              open={true}
              sx={{ position: 'relative', zIndex: 1500 }}
            >
              <Alert severity={type} sx={{ width: '100%' }}>
                {message}
              </Alert>
            </Snackbar>
          ))
        ) : (
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            autoHideDuration={timeout}
            open={true}
            sx={{ position: 'relative', zIndex: 1500 }}
          >
            <Alert severity={type} sx={{ width: '100%' }}>
              {message}
            </Alert>
          </Snackbar>
        )}
      </>
    </Box>
  );

  setTimeout(() => {
    root.unmount();
    document.body.removeChild(container);
  }, timeout);
};

export default showNotification;
