import type { NextPage, GetServerSideProps } from 'next';
import React from 'react';
import RestorePassword from '@/containers/RestorePassword';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const RestorePasswordPage: NextPage = ({}) => {
  return <RestorePassword />;
};

export const getServerSideProps: GetServerSideProps<any> = async ({
  locale
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export default RestorePasswordPage;
