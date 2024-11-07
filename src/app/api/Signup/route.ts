import { dbConnect } from "@/app/lib/dbConnect";
import UserModel from "@/app/Models/User";
import bcrypt from "bcryptjs"
import { SendVerificationEmail } from "@/app/helper/SendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const {email,username,password}=await req.json();
        const useremailexits=await UserModel.findOne({ email})
        if(useremailexits){
            //check weather user is verifed or not
            if(useremailexits.verified){
                return Response.json({ success: false, message: "User Already Exists"}, { status: 400 });
            }
            else{
                await SendVerificationEmail(useremailexits.verifyCode,username,email);
            }

        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await UserModel.create({
                email,
                username,
                password: hashedPassword,
                verifyCode: Math.floor(100000 + Math.random() * 900000),
                verified: false,
                verifyExpires: new Date(Date.now() + 5 * 60 * 1000),
                isAcceptMessage: true,
                messages: [],
              });

              if(!user){
                return Response.json({ success: false, message: "Registering Failed"}, { status: 400 });
              }

              await SendVerificationEmail(user.verifyCode,username,email);
            
        }
    } catch (error) {
        console.log("Registering Failed User failed Error: !", error);
        return Response.json({ success: false, message: "Registering Failed"}, { status: 400 });
    }
}
