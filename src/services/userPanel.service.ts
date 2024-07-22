import YVEAApi from '@config/axios.conf';
import {IBuyerForm} from "@/interfaces/buyerAndSellerts";

class UserPanelServices {
    updateBuyerInformation( id: string, data: IBuyerForm) {
        return YVEAApi.put(`/buyers/${id}`, data);
    }

    getDocumentUrl  (id: string) {
        return YVEAApi.get(`/storage/signed-url/${id}`);
    }
    updateSellerInformation( id: string, data: IBuyerForm) {
        return YVEAApi.put(`/sellers/${id}`, data);
    }

    updatePlaceInformation( id: string, data: IBuyerForm) {
        return YVEAApi.put(`/inspection-places/${id}`, data);
    }
}

const userPanelServices = new UserPanelServices();
export default userPanelServices;
