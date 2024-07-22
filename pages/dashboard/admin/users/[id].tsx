import type { NextPage, GetStaticProps } from 'next';
import React from 'react';
import UserDetailContainer from '@containers/admin/users/UserDetailContainer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const UserDetail: NextPage = () => {
  return <UserDetailContainer />;
};

export const getStaticProps: GetStaticProps<any> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}

export default UserDetail;
