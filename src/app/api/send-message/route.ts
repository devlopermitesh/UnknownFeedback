import { dbConnect } from "@/app/lib/dbConnect";
import UserModel, { Message } from "@/app/Models/User";

export async function POST(req: Request) {
await dbConnect();
try {
    await dbConnect();
    const {username,messageContent}=await req.json();
    //find user 
    const user=await UserModel.findOne({username});
    if(!user){
        return new Response(JSON.stringify({ success: false, message: "failed to find user" }), { status: 404 });
    }
    //check weather user accept message or not 
    if(!user.isAcceptMessage){
        return new Response(JSON.stringify({ success: false, message: "User is not accepting message" }), { status: 403 });
    }
    //create message
            const newMessage = {
                context: messageContent.content,  
                createdAt: messageContent.createdAt  
            };
    
            user.messages.push(newMessage as Message);
    
            await user.save();
    
            return new Response(JSON.stringify({ success: true, message: "Message sent successfully" }), { status: 200 });
        

} catch (error) {

    console.log("Error sending  message:", error);
    return new Response(JSON.stringify({ success: false, message: "Error sending message" }), { status: 500 });}

}