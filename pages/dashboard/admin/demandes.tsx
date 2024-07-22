import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import DemandesContainer from '@containers/admin/DemandesContainer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const DemandesPages: NextPage<any> = ({}) => {
  return <DemandesContainer />;
};

export const getServerSideProps: GetServerSideProps<any> = async ({
  locale
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export default DemandesPages;
