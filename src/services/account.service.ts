import YVEAApi from '@config/axios.conf';

class AccountServices {
  updateUser(data) {
    return YVEAApi.put('/users', data);
  }

  getCompanyTypes() {
    return YVEAApi.get('/companies/types');
  }

  getUserProfile() {
    return YVEAApi.get('/users');
  }

  getUserData(id: any) {
    return YVEAApi.get(`/users/${id}`);
  }
}

const accountServices = new AccountServices();
export default accountServices;
