import { ReactNode, useEffect, useState } from 'react';

import SideBar from './Sidebar';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import { ROUTES } from '@/constans/routes';
import { Assistant } from '@components/atoms/Assistant';
import { useSelector } from 'react-redux';
import { appState } from '@/store';
import { LanguageSelector } from '../atoms/LanguageSelector';

export const Layout = ({ children }: { children: ReactNode }) => {
  const [showLayout, setShowLayout] = useState<boolean>(true);
  const router = useRouter();
  const userData = useSelector(({ users }: appState) => users);

  useEffect(() => {
    if (!router.isReady) return;
    if (
      (router.asPath.includes(ROUTES.USER_DASHBOARD) &&
        router.pathname !== ROUTES.USER_DASHBOARD_REQUEST) ||
      router.asPath.includes(ROUTES.ADMIN_DASHBOARD) ||
      (router.asPath.includes(ROUTES.CERTIFICATE_DETAIL) &&
        !router.asPath.includes(ROUTES.USER_DASHBOARD_REQUEST))
    ) {
      setShowLayout(true);
    } else {
      setShowLayout(false);
    }
  }, [router.asPath]);

  return (
    <>
      {showLayout && (
        <>
          <SideBar />
        </>
      )}
      <Box
        sx={{
          backgroundColor: 'white',
          paddingLeft: showLayout
            ? { sx: '10px', md: '10px', lg: '320px' }
            : '10',
          zIndex: 0
        }}
        paddingTop={showLayout ? 3 : 0}
      >
        {children}
        {<LanguageSelector />}
        {userData?.email && <Assistant />}
      </Box>
    </>
  );
};
