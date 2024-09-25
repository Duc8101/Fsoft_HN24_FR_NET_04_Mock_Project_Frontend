import { CartItem } from "./cart";

export interface UserInfo {
    userId : number,
    username : string,
    fullName : string,
    phone : string,
    email : string,
    address: string,
    cartDetailDTOs : CartItem[]
 }