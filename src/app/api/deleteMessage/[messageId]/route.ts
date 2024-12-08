import { dbConnect } from "@/app/lib/dbConnect";
import UserModel from "@/app/Models/User";
import { getServerSession } from "next-auth";
import { Authoptions } from "../../auth/[...nextauth]/options";
import { NextRequest } from 'next/server';
export async function DELETE(req: NextRequest, { params }:  any) {
    const dataparams=await params
    const messageId =dataparams.messageId;
    // Ensure the messageId is valid
    if (!messageId) {
        return new Response(JSON.stringify({ success: false, message: "Message ID is required" }), { status: 400 });
    }

    // Connect to the database
    await dbConnect();
    console.log("messageId is", messageId);

    // Get the session to verify the user is authorized
    const session = await getServerSession(Authoptions);
    if (!session || !session.user) {
        return new Response(JSON.stringify({ success: false, message: "Not authorized" }), { status: 401 });
    }

    const userId = session.user._id;

    try {
        // Attempt to delete the message from the user's messages array
        const responseDeleteMessage = await UserModel.updateOne(
            { _id: userId, "messages._id": messageId },
            { $pull: { messages: { _id: messageId } } }
        );

        if (responseDeleteMessage.modifiedCount === 0) {
            return new Response(JSON.stringify({ success: false, message: "Failed to delete message, message does not exist" }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, message: "Message deleted successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error in deleting message", error);
        return new Response(JSON.stringify({ success: false, message: "Error in deleting message" }), { status: 500 });
    }
}
