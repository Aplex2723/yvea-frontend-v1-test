import type { NextPage, GetServerSideProps } from 'next';
import React from 'react';
import RequestFormContainer from '@containers/request-form/RequestFormContainer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const FirstFormPage: NextPage<NextPage> = ({}) => {
  return <RequestFormContainer />;
};

export const getServerSideProps: GetServerSideProps<any> = async ({
  locale
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export default FirstFormPage;
