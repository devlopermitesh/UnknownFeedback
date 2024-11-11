import { dbConnect } from "@/app/lib/dbConnect";
import {Authoptions} from "../auth/[...nextauth]/options";
import UserModel from "@/app/Models/User";
import { User as TypeUser} from "next-auth"
import {getServerSession,} from "next-auth"
import mongoose from "mongoose";

export async function GET(req: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(Authoptions);
        if(!session) return new Response(JSON.stringify({success:false,message:"Not authorized"}),{status:401})
        const user=session?.user as TypeUser;
         const userId=new mongoose.Types.ObjectId(user._id)

        //have to make a group for message 
        const allMessages = await UserModel.aggregate([
            {
                $match: {
                    _id: userId,  // Match the current user by their ID
                },
            },
            {
                $unwind: "$messages",  // Unwind the messages array to process each message
            },
            {
                $sort: { "messages.createdAt": -1 },  // Sort the messages by createdAt field in descending order
            },
            {
                $group: {
                    _id: null,  // We are grouping all messages into a single group
                    messages: { $push: "$messages" },  // Push all the messages into an array
                },
            },
        ]);
        if (allMessages.length === 0|| !allMessages) {
            return new Response(
                JSON.stringify({ success: true, message: "No User  found", data: [] }),
                { status: 200 }
            );
        }
console.log(allMessages)
        // Return the grouped messages
        return new Response(
            JSON.stringify({ success: true, data: allMessages[0].messages }),
            { status: 200 }
        );
    } catch (error) {
        
    console.log("Error reading  message:", error);
    return new Response(JSON.stringify({ success: false, message: "Error reading message" }), { status: 500 });
    }
}