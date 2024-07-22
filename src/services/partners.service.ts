import YVEAApi from '@config/axios.conf';

class PartnerServices {
    getCategories( ) {
        return YVEAApi.get(`/categories`);
    }
    getPartner(id) {
        return YVEAApi.get(`/partners/${id}`);
    }
    getPartners() {
        return YVEAApi.get(`/partners`);
    }

    createPartner(data) {
        return YVEAApi.post('/partners', data);
      }
    updatePartner(id, data) {
        return YVEAApi.put(`/partners/${id}`, data);
      }
    deletePartner(id) {
        return YVEAApi.delete(`/partners/${id}`);
      }
}

const partnerServices = new PartnerServices();
export default partnerServices;
