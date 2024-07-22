import * as yup from "yup";
import { IBuyerForm, IPlaceForm } from '@/interfaces/buyerAndSellerts';


export const buyerSellerFormSchema: yup.ObjectSchema<IBuyerForm> = yup.object().shape({
    name: yup.string().required('le nom de famille est requis'),
    email: yup.string().email("e-mail invalide").required("e-mail requis"),
    phone: yup.string().required("téléphone requis"),
    address: yup.string().required("adresse requise"),
    postal_code: yup.string().required("code postal requis"),
    city: yup.string().required("ville requise"),
    country: yup.string().required("pays requis")
});

export const placeFormSchema: yup.ObjectSchema<IPlaceForm> = yup.object().shape({
    name: yup.string().required('le nom de famille est requis'),
    email: yup.string().email("e-mail invalide").required("e-mail requis"),
    phone: yup.string().required("téléphone requis"),
    address: yup.string().required("adresse requise"),
    postal_code: yup.string().required("code postal requis"),
    city: yup.string().required("ville requise"),
    country: yup.string().required("pays requis"),
    contact_name: yup.string().required("nom de contact requis"),
    contact_lastname: yup.string().required("nom de famille de contact requis")
});