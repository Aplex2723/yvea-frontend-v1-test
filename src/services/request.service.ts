import YVEAApi from '@config/axios.conf';
import { ISimulation } from '@/interfaces/simulation';
import { IProvider } from '@/interfaces/providers';
import { IShipping } from '@/interfaces/shipping';

class RequestServices {
  getCountries() {
    return YVEAApi.get('/countries');
  }

  getCountryDetails(id: number | string) {
    return YVEAApi.get(`/countries/${id}/details`);
  }

  getCodes(countryId: string, code: string) {
    return YVEAApi.get(`/countries/${countryId}/codes?code=${code}`);
  }

  getUsers() {
    return YVEAApi.get('/users');
  }

  getCertificates() {
    return YVEAApi.get(`/certificates?take=50`);
  }

  postSimulation() {
    return YVEAApi.post('/certificates');
  }

  putSimulation(data: ISimulation, id: number) {
    return YVEAApi.put(`/certificates/${id}`, data);
  }

  getSellers() {
    return YVEAApi.get('/sellers?take=50');
  }

  getSeller(id: number | string) {
    return YVEAApi.get(`/sellers/${id}`);
  }

  getBuyers() {
    return YVEAApi.get('/buyers?take=50');
  }

  getBuyer(id: number | string) {
    return YVEAApi.get(`/buyers/${id}`);
  }

  getInspectionPlaces() {
    return YVEAApi.get('/inspection-places?take=50');
  }

  getInspectionPlace(id: number | string) {
    return YVEAApi.get(`/inspection-places/${id}`);
  }

  getCertificadesMethods() {
    return YVEAApi.get('/certificates/methods');
  }

  getCertificadesIncoterms() {
    return YVEAApi.get('/certificates/incoterms');
  }

  putPrestataries(data: IProvider, id: number | string) {
    return YVEAApi.put(`/certificates/${id}`, data);
  }

  putShipping(data: IShipping, id: number | string) {
    return YVEAApi.put(`/certificates/${id}`, data);
  }

  putProductDocuments(data: any, id: number | string) {
    return YVEAApi.put(`/certificates/${id}`, data);
  }

  getUserData(id: number | string) {
    return YVEAApi.put(`/certificates/${id}`);
  }

  uploadDocuments(data: any, id: number) {
    return YVEAApi.put(`/certificates/${id}`, data);
  }

  deleteDocument(type: any, id: number) {
    return YVEAApi.delete(`/certificates/${id}`, type);
  }

  getCertificate(id: string[] | string) {
    return YVEAApi.get(`/certificates/${id}`);
  }

  getSizeUnit() {
    return YVEAApi.get(`/certificates/products/size-units`);
  }

  updateData(data: any, id: any) {
    return YVEAApi.put(`/certificates/${id}`, data);
  }

  getCertificatesByUser(id: any) {
    return YVEAApi.get(`/certificates/users/${id}/all`);
  }
  deleteCertificate(id: any) {
    return YVEAApi.delete(`/certificates/${id}`);
  }
}

const requestServices = new RequestServices();
export default requestServices;
