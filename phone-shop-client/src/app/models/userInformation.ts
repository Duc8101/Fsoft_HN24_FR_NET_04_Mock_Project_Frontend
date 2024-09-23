import { CartItem } from "./cart";

export interface UserInfo {
    userId : number,
    username : string,
    fullname : string,
    phone : string,
    email : string,
    address: string,
    cartItems : CartItem[]
 }