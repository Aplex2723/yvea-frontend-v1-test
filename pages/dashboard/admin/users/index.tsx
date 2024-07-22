import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import UsersContainer from '@containers/admin/users/UsersContainer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const UsersPage: NextPage = ({}) => {
  return <UsersContainer />;
};

export const getServerSideProps: GetServerSideProps<any> = async ({
  locale
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});
export default UsersPage;
