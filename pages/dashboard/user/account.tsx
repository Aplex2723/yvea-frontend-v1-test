import type { NextPage, GetServerSideProps } from 'next';
import React from 'react';
import AccountContainer from '@containers/AccountContainer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const FirstFormPage: NextPage = ({}) => {
  return <AccountContainer />;
};

export const getServerSideProps: GetServerSideProps<any> = async ({
  locale
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export default FirstFormPage;
