import React from 'react';
import { Box, Modal } from '@mui/material';

interface IEmptyModalProps {
  children?: React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 560,
  maxHeight: '100vh',
  borderRadius: '16px',
  backgroundColor: 'background.paper',
  boxShadow: 24,
  p: 3
};
export const EmptyModal: React.FC<IEmptyModalProps> = ({
  children,
  isOpen,
  onClose
}) => {
  return (
    <Modal
      open={isOpen}
      sx={{ height: '100%' }}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>{children}</Box>
    </Modal>
  );
};
