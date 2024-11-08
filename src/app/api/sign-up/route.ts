import { dbConnect } from "@/app/lib/dbConnect";
import UserModel from "@/app/Models/User";
import bcrypt from "bcryptjs";
import { SendVerificationEmail } from "@/app/helper/SendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { email, username, password } = await req.json();
console.log(email,username,password)
        // Check if a verified user with the same username already exists
        const existingUserVerifiedByUsername = await UserModel.findOne({ username, verified: true });
        if (existingUserVerifiedByUsername) {
            return Response.json({ success: false, message: "Registering Failed - Username already exists" }, { status: 400 });
        }

        // Check if a user with the same email already exists
        const userWithEmail = await UserModel.findOne({ email });
        if (userWithEmail) {
            if (userWithEmail.verified) {
                return Response.json({ success: false, message: "User Already Exists" }, { status: 400 });
            } else {
                // If user exists but is not verified, update their password and verification code
                const hashedPassword = await bcrypt.hash(password, 10);
                userWithEmail.password = hashedPassword;
                userWithEmail.verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
                userWithEmail.verifyExpires = new Date(Date.now() + 5 * 60 * 1000);
                await userWithEmail.save();
            }
        } else {
            // Create a new user if no existing user with the same email is found
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await UserModel.create({
                email,
                username,
                password: hashedPassword,
                verifyCode: Math.floor(100000 + Math.random() * 900000).toString(),
                verified: false,
                verifyExpires: new Date(Date.now() + 5 * 60 * 1000),
                isAcceptMessage: true,
                messages: [],
            });

            if (!newUser) {
                return Response.json({ success: false, message: "Registering Failed" }, { status: 400 });
            }

            // Send verification email to the new user
            const emailResponse = await SendVerificationEmail(newUser.verifyCode, username, email);
            if (!emailResponse.success) {
                return Response.json({ message: emailResponse.message, success: false }, { status: 500 });
            }
            
            return Response.json({
                message: "User registered successfully! Please verify your code.",
                success: true
            }, { status: 200 });
        }
    } catch (error) {
        console.log("Registering user failed: ", error);
        return Response.json({ success: false, message: "Registering Failed" }, { status: 400 });
    }
}
