import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import RegisterForm from '@containers/register-form/RegisterForm';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const RegisterFormPage: NextPage = ({}) => {
  return <RegisterForm />;
};

export const getServerSideProps: GetServerSideProps<any> = async ({
  locale
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});
export default RegisterFormPage;
