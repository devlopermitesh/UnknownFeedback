import { dbConnect } from "@/app/lib/dbConnect";
import {Authoptions} from "../auth/[...nextauth]/options";
import UserModel from "@/app/Models/User";
import {Session, User as TypeUser} from "next-auth"
import {getServerSession,} from "next-auth"
export async function POST(req: Request) {
    await dbConnect();
  const session=await getServerSession(Authoptions)
  if(!session || !session.user) return new Response(JSON.stringify({success:false,message:"Not authorized"}),{status:401})
  const user: TypeUser = session.user as TypeUser;
   try {
 //updating isAcceptMessage to true for the user   
 const {acceptmessagestatus}=await req.json();
 const updatedUser = await UserModel.findOneAndUpdate({ _id: user._id }, { isAcceptMessage: acceptmessagestatus }, { new: true });
 if(!updatedUser){
    return new Response(JSON.stringify({ success: false, message: "failed to uodate accept message status" }), { status: 401 });
 }

 return new Response(JSON.stringify({ success: true, message: "Message accepted",updatedUser }), { status: 200 });
   } catch (error) {
    console.log("Error accepting message:", error);
    return new Response(JSON.stringify({ success: false, message: "Error accepting message" }), { status: 500 });
   }



}

export async function Get(req: Request) {
  await dbConnect();
  const session=await getServerSession(Authoptions)
  if(!session || !session.user) return new Response(JSON.stringify({success:false,message:"Not authorized"}),{status:401})
  const user: TypeUser = session.user as TypeUser;
  
  try {
 const foundUser=await UserModel.findOne({ _id: user._id });
 if(!foundUser){
    return new Response(JSON.stringify({ success: false, message: "failed found user" }), { status: 404 });
 }
 return new Response(JSON.stringify({ success: true, AcceptingMessage: foundUser.isAcceptMessage }), { status: 200 });
    
  } catch (error) {
    console.log("Error accepting message:", error);
    return new Response(JSON.stringify({ success: false, message: "Error accepting message" }), { status: 500 });
  }

}