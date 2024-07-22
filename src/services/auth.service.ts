import YVEAApi from '@config/axios.conf';

class AuthServices {
  login(data) {
    return YVEAApi.post('/auth/login', data);
  }

  register(data) {
    return YVEAApi.post('/auth/register', data);
  }
  forgotPassword(data) {
    return YVEAApi.post('/auth/forgot-password', data);
  }

  restorePassword(data) {
    return YVEAApi.post('/auth/recover-password', data);
  }
}

const backofficeServices = new AuthServices();
export default backofficeServices;
