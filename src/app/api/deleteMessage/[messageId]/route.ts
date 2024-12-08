import { dbConnect } from "@/app/lib/dbConnect";
import UserModel from "@/app/Models/User";
import { getServerSession } from "next-auth";
import { Authoptions } from "../../auth/[...nextauth]/options";
import { NextApiRequest, NextApiResponse } from "next";

// DELETE request handler
export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
    const { messageId } = req.query; // Access messageId from query parameters

    // Ensure the messageId is valid
    if (!messageId || typeof messageId !== "string") {
        return res.status(400).json({ success: false, message: "Message ID is required and must be a string" });
    }

    // Connect to the database
    await dbConnect();
    console.log("messageId is", messageId);

    // Get the session to verify the user is authorized
    const session = await getServerSession(Authoptions);
    if (!session || !session.user) {
        return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const userId = session.user._id;

    try {
        // Attempt to delete the message from the user's messages array
        const responseDeleteMessage = await UserModel.updateOne(
            { _id: userId, "messages._id": messageId },
            { $pull: { messages: { _id: messageId } } }
        );

        if (responseDeleteMessage.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "Failed to delete message, message does not exist" });
        }

        return res.status(200).json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error in deleting message", error);
        return res.status(500).json({ success: false, message: "Error in deleting message" });
    }
}
