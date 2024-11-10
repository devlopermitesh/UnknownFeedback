import { dbConnect } from "@/app/lib/dbConnect"
import UserModel from "@/app/Models/User";
import { getServerSession } from "next-auth";
import { Authoptions } from "../../auth/[...nextauth]/options";


export async function DELETE(req: Request,{ params }: { params: { messageId: string } }){
 const messageId=params.messageId   
 dbConnect();
 const session=await getServerSession(Authoptions)
 if(!session || !session.user) return new Response(JSON.stringify({success:false,message:"Not authorized"}),{status:401})
    const userid=session.user._id
 try {
    const responsedeletemessage=await UserModel.updateOne({_id:userid},{ $pull: { messages: { _id:messageId} } });
    if(responsedeletemessage.modifiedCount===0){
        return new  Response(JSON.stringify({ success: false, message: "failed to delete message,message does not exist" }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, message: "message deleted successfully" }), { status: 200 });
 } catch (error) {
    console.log("error in deleting message",error);
    return new Response(JSON.stringify({ success: false, message: "error in deleting message" }), { status: 500 });
 }
}