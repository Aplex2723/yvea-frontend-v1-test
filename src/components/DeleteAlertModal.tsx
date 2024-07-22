import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface DeleteAlertModalProps {
  isOpen: boolean;
  closingAction: () => void;
  confirmAction: () => void;
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

export const DeleteAlertModal: React.FC<DeleteAlertModalProps> = ({
  isOpen,
  closingAction,
  confirmAction
}) => {
  const { t } = useTranslation();
  const [deleting, setDeleting] = useState<boolean>(false);

  const handleConfirm = () => {
    setDeleting(true);
    confirmAction()
  };
  
  useEffect(() => {
    setDeleting(false)
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onClose={closingAction}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          variant={'body2'}
          sx={{
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            mb: '1rem',
            color: 'success.main'
          }}
        >
          {t('delete_confirmation')}
        </Typography>
        <Typography
          variant={'body2'}
          sx={{ textAlign: 'center', fontSize: '18px', mb: '2rem' }}
        >
          {t('sure_to_delete')}
        </Typography>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <Button
            onClick={closingAction}
            variant={'outlined'}
            size={'small'}
            disabled={deleting}
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            variant={'contained'}
            size={'small'}
            disabled={deleting}
          >
            {deleting ? (
              <CircularProgress
                color="primary"
                variant="indeterminate"
                size={20}
              />
            ) : (
              t('delete')
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
