import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import {MarketplaceManagementContainer} from '@containers/admin/MarketplaceManagementContainer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const MarketPlace: NextPage = () => {
  return <MarketplaceManagementContainer />;
};

export const getServerSideProps: GetServerSideProps<any> = async ({
  locale
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export default MarketPlace;
