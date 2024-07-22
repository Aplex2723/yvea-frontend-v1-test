import React, { ReactNode } from 'react';
import { Box, Button, Modal } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface SimpleModalProps {
  children: ReactNode;
  isOpen: boolean;
  closingAction: () => void;
  withAcceptButton?: boolean;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  borderRadius: '16px',
  backgroundColor: 'background.paper',
  boxShadow: 24,
  p: 4
};

export const SimpleModal: React.FC<SimpleModalProps> = ({
  isOpen,
  children,
  closingAction,
  withAcceptButton = true
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      open={isOpen}
      onClose={closingAction}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {children}
        {withAcceptButton && (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
            <Button
              onClick={closingAction}
              variant={'contained'}
              size={'small'}
            >
              {t('accept')}
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};
