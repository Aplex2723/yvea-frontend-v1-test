import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import {MarketplaceContainer} from '@containers/MarketplaceContainer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const MarketPlace: NextPage = () => {
  return <MarketplaceContainer />;
};

export const getServerSideProps: GetServerSideProps<any> = async ({
  locale
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export default MarketPlace;
