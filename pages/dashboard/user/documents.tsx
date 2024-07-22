import type { NextPage, GetServerSideProps } from 'next';
import React from 'react';
import DocumentsContainer from '@containers/DocumentsContainer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const FirstFormPage: NextPage = ({}) => {
  return <DocumentsContainer />;
};

export const getServerSideProps: GetServerSideProps<any> = async ({
  locale
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});
export default FirstFormPage;
