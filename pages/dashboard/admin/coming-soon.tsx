import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import ComingSoonContainer from '@containers/ComingSoonContainer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
interface PropsPage {
  userAgent?: string;
}
const ComingSoonPage: NextPage<PropsPage> = ({}) => {
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
