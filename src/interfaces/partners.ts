import { Categories } from "./enums"

export interface IPartner{
    id:string,
    logo_url:string,
    name:string,
    description:string,
    site_url:string
    percentage: number,
    categories:Array<Categories>
   }