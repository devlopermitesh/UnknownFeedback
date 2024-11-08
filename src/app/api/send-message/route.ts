import { dbConnect } from "@/app/lib/dbConnect";
import UserModel, { Message } from "@/app/Models/User";

async function Post(req: Request) {
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
                context: messageContent,  
                createdAt: new Date()    
            };
    
            user.messages.push(newMessage as Message);
    
            await user.save();
    
            return { success: true, message: "Message added successfully" };
        

} catch (error) {

    console.log("Error sending  message:", error);
    return new Response(JSON.stringify({ success: false, message: "Error sending message" }), { status: 500 });}

}