import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import PaysContainer from '@containers/admin/PayContainer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ComingSoonPage: NextPage = () => {
  return <PaysContainer />;
};

export const getServerSideProps: GetServerSideProps<any> = async ({
  locale
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export default ComingSoonPage;
