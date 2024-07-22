import type { NextPage, GetServerSideProps } from 'next';
import React from 'react';
import ComingSoonContainer from '@containers/ComingSoonContainer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ComingSoonPage: NextPage = ({}) => {
  return <ComingSoonContainer />;
};

export const getServerSideProps: GetServerSideProps<any> = async ({
  locale
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export default ComingSoonPage;
