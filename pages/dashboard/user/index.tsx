import type { NextPage, GetServerSideProps } from 'next';
import React from 'react';
import UserDashboardContainer from '@containers/UserDashboardContainer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const FirstFormPage: NextPage = ({}) => {
  return <UserDashboardContainer />;
};
export const getServerSideProps: GetServerSideProps<any> = async ({
  locale
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});
export default FirstFormPage;
