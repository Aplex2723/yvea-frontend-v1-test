import * as React from 'react';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

interface ISideBarLinkProps {
  title: string;
  active?: boolean;
  icon: React.ReactNode;
  link: string;
  focus?: boolean
}

export const SideBarLink: React.FC<ISideBarLinkProps> = ({
                                                           active = false,
                                                           title,
                                                           link,
                                                           icon,
                                                         }) => {
  return (
    <Link href={link} style={{ display: 'flex', width: '100%' }}>
      <ListItemButton
        sx={{
          backgroundColor: active ? '#7f56d9' : 'secondary.500',
          height: '40px',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '4px',
          '&:hover': {
            boxShadow: '0px 4px 6px 0px #2623410F',
          }
        }}
      >
        <ListItemIcon sx={{ minWidth: '30px', color: 'white' }}>
          {icon}
        </ListItemIcon>
        <ListItemText
          disableTypography
          primary={
            <Typography variant='body2' style={{ color: 'white', fontWeight:'bold', fontSize:'16px' }}>
              {title}
            </Typography>
          }
        />
      </ListItemButton>
    </Link>
  );
};
