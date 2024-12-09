import {z} from "zod";
import { usernamevalidation} from "@/app/schemas/signupSchema";
import UserModel from "@/app/Models/User";
import { dbConnect } from "@/app/lib/dbConnect";
const UsernameQuerySchema=z.object({
    username:usernamevalidation
})

export async function GET(req: Request) {
    await dbConnect();
    if(req.method!=="GET"){
        return Response.json({ success: false, message: "Method not allowed" }, { status: 405 });
    }
    try {
        const {searchParams}=new URL(req.url)
        const queryparams={
            username:searchParams.get("username")
        }
        const result= UsernameQuerySchema.safeParse(queryparams)
        if(!result.success){
            const usernameErrors=result.error.format().username?._errors||[]
            return Response.json({ success: false, message:(usernameErrors.length)>0?usernameErrors.join(','):"invalid username" }, { status: 400 });
        }

const {username}=result.data

        const existingUserVerifiedByUsername = await UserModel.findOne({ username});
        if(existingUserVerifiedByUsername && existingUserVerifiedByUsername.verified){
return Response.json({ success: false, message: "Username already exists" }, { status: 400 });
}



return Response.json({ success: true, message: "Username available",data:existingUserVerifiedByUsername?.email }, { status: 200 });

        
    } catch (error) {
        // console.log("errror",error)
        return Response.json({ success: false, message: "Registering Failed" }, { status: 400 });
    }
}