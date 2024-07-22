import axios from 'axios';
import getConfig from 'next/config';

const { publicRuntimeConfig = {} } = getConfig() || {};

const BUCKETEER_URL = publicRuntimeConfig.BUCKETEER_URL;

export const getToken = async () => {
  try {
    const resp = await axios.get(`${BUCKETEER_URL}csrftoken`);
    return resp.data.csrf_token;
  } catch (err) {
    console.error(err);
  }
};

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
      if (encoded.length % 4 > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = (error) => reject(error);
  });
}

export const generateImageUrl = async (file, token) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': token,
    },
  };
  try {
    let base64 = await getBase64(file);
    const body = {
      body: base64,
      key: `yvea-images/${Date.now()}.png`,
      content_type: 'image/png',
      metadata: {
        meta: 'data',
      },
    };

    const resp = await axios.post(`${BUCKETEER_URL}putb64`, body, config);
    return resp;
  } catch (err) {
    console.error(err);
  }
};

export const generateImageUrlFromBase64 = async (imgString, id, token, basePath='impact-indicators') => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': token,
    },
  };
  try {
    let base64 = imgString;
    const body = {
      body: base64,
      key: `${basePath}/${Date.now()}/${id}.png`,
      content_type: 'image/png',
      metadata: {
        meta: 'data',
      },
    };

    const resp = await axios.post(`${BUCKETEER_URL}putb64`, body, config);
    return resp;
  } catch (err) {
    console.error(err);
  }
};

export const generateFileUrl = async (file, token, name) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': token,
    },
  };
  try {
    let base64 = await getBase64(file);
    const body = {
      body: base64,
      key: `forms/${Date.now()}/${name}.pdf`,
      content_type: 'application/pdf',
      metadata: {
        meta: 'data',
      },
    };

    const resp = await axios.post(`${BUCKETEER_URL}putb64`, body, config);
    return resp;
  } catch (err) {
    console.error(err);
  }
};
