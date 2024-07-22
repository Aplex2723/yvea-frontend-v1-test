import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { sideBarMenuItems } from '@/data/sidebarItems';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { SideBarLink } from '@/components/layout/SidebarLink';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Box, Divider, Typography } from '@mui/material';
import { ROUTES } from '@/constans/routes';
import IconButton from '@mui/material/IconButton';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { logOut } from '@store/users/reducer';
import { useAppDispatch } from '@hooks/redux';
import { useSelector } from 'react-redux';
import { appState } from '@/store';
import { ROLES } from '@/constans/roles';
import { useTranslation } from 'react-i18next';

const drawerWidth = 312;

export default function Sidebar() {
  /*hooks*/
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { roleName, userName, email } = useSelector(
    ({ users }: appState) => users
  );
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    dispatch(logOut());
    router.push(ROUTES.HOME);
  };

  // Function to get cookie value by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const token = getCookie('access_token'); // Retrieve the token from cookies
  console.log(`JWT: ${token}`)
  const exportAssistantLink = `https://export-assistant.azurewebsites.net/?token=${token}`; // Construct the URL for Export Assistant
  console.log(`Link to assistant: ${exportAssistantLink}`)

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          zIndex: 10,
          boxSizing: 'border-box',
          width: drawerWidth,
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: 'secondary.500',
          padding: '2rem .5rem 0',
          boxShadow: 3
        }
      }}
      variant="permanent"
      anchor="left"
    >
      <Box>
        <Toolbar>
          <Image
            src={
              i18n.language === 'en'
                ? '/icons/en_white_logo.svg'
                : '/icons/fr_white_logo.svg'
            }
            alt={'yvea logo'}
            width={200}
            height={80}
            style={{ marginBottom: '1rem' }}
          />
        </Toolbar>
        <List>
          {sideBarMenuItems.map(
            (item) =>
              item.role === roleName && (
                <ListItem key={item.id}>
                  <SideBarLink
                    title={t(item.title)}
                    active={router.asPath === item.link}
                    link={item.title === 'export_assistant' ? exportAssistantLink : item.link} // Use the constructed link for Export Assistant
                    icon={item.icon}
                  />
                </ListItem>
              )
          )}
          {roleName === ROLES.USER && (
            <ListItem>
              <SideBarLink
                title={t('account')}
                active={router.asPath.includes(ROUTES.USER_PROFILE)}
                link={ROUTES.USER_PROFILE}
                icon={<SettingsOutlinedIcon />}
              />
            </ListItem>
          )}
        </List>
      </Box>

      <List>
        <Divider sx={{ mt: '2rem' }} />
        <ListItem
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'start',
              alignItems: 'start',
              width: 'calc(100% - 48px)'
            }}
          >
            <Typography>{userName ?? 'test doe'}</Typography>
            <Typography
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '90%'
              }}
            >
              {email ?? 'admin@gmail.com'}
            </Typography>
          </Box>
          <IconButton onClick={() => handleLogout()}>
            <LogoutOutlinedIcon sx={{ color: 'white' }} />
          </IconButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
