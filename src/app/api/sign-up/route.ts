
import { dbConnect } from "@/app/lib/dbConnect";
import UserModel from "@/app/Models/User";
import bcrypt from "bcryptjs";
import { SendVerificationEmail } from "@/app/helper/SendVerificationEmail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { email, username, password } = await req.json();
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Check if a verified user with the same username already exists
        const existingUserVerifiedByUsername = await UserModel.findOne({ username, verified: true });
        if (existingUserVerifiedByUsername) {
            return NextResponse.json({ success: false, message: "Registering Failed - Username already exists" }, { status: 400 });
        }

        // Check if a user with the same email already exists
        const userWithEmail = await UserModel.findOne({ email });
        if (userWithEmail) {
            if (userWithEmail.verified) {
                return NextResponse.json({ success: false, message: "User Already Exists" }, { status: 400 });
            } else {
                // If user exists but is not verified, update their password and verification code
                const hashedPassword = await bcrypt.hash(password, 10);
                userWithEmail.password = hashedPassword;
                userWithEmail.verifyCode = verifyCode.toString();
                userWithEmail.verifyExpires = new Date(Date.now() + 5 * 60 * 1000);
                await userWithEmail.save();
                
            // Send verification email to the updated user
            const emailResponse = await SendVerificationEmail(userWithEmail.verifyCode, username, email);
            if (!emailResponse.success) {
                return NextResponse.json({ message: emailResponse.message, success: false }, { status: 500 });
            }
            
            return NextResponse.json({
                message: "Verification code resent. Please check your email.",
                success: true
            }, { status: 200 });


            }
        } else {
            // Create a new user if no existing user with the same email is found
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await UserModel.create({
                email,
                username,
                password: hashedPassword,
                verifyCode,
                verified: false,
                verifyExpires: new Date(Date.now() + 5 * 60 * 1000),
                isAcceptMessage: true,
                messages: [],
            });

            if (!newUser) {
                return NextResponse.json({ success: false, message: "Registering Failed" }, { status: 400 });
            }

            // Send verification email to the new user
            console.log("i am going to send email")
            const emailResponse = await SendVerificationEmail(newUser.verifyCode, username, email);
console.log(emailResponse)
            if (!emailResponse.success) {
                return NextResponse.json({ message: emailResponse.message, success: false }, { status: 500 });
            }
            return NextResponse.json({
                message: "User registered successfully! Please verify your code.",
                success: true
            }, { status: 200 });
        }
    } catch (error) {
        console.log("Registering user failed: ", error);
        return NextResponse.json({ success: false, message: "Registering Failed" }, { status: 400 });
    }
}
