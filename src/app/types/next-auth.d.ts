import "next-auth"
import { DefaultSession } from "next-auth";

declare module "next-auth"{
    interface User{
        _id?:string;
        username?:string
        verified?:boolean
        isAcceptMessage?: boolean
    }
    interface Session{
        user:{
            _id?:string;
            username?:string
            verified?:boolean
            isAcceptMessage?: boolean
        } & DefaultSession['user']
    }
    interface Jwt{
        _id?:string;
        username?:string
        verified?:boolean
        isAcceptMessage?: boolean
    }
}