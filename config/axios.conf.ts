import axios from 'axios';
import getConfig from 'next/config';

import { getLagunage } from '../utils/common';
const { publicRuntimeConfig } = getConfig();

const YVEAApi = axios.create({
  baseURL: `${publicRuntimeConfig.API_URL}`,
  headers: {
    accept: '*/*',
    'content-Type': 'application/json'
  },
  withCredentials: true
});

YVEAApi.interceptors.request.use(
  function (config) {
    const language = getLagunage();

    config.headers['Accept-Language'] = language;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export default YVEAApi;
