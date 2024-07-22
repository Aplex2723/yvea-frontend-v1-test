import type { NextPage, GetServerSideProps } from 'next';
import React from 'react';
import CerticateDetailContainer from '@/containers/CerticateDetailContainer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const CerticateDetailPage: NextPage = ({}) => {
  return <CerticateDetailContainer />;
};

export const getServerSideProps: GetServerSideProps<any> = async ({
  locale
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});
export default CerticateDetailPage;
