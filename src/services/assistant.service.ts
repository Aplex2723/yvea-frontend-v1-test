import YVEAApi from '@config/axios.conf';

class AcssistantServices {
  sendQuestion(data) {
    return YVEAApi.post('/virtual-assistant', data);
  }
}

const assistantServices = new AcssistantServices();
export default assistantServices;
