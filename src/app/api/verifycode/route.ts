import { z } from "zod";
import { dbConnect } from "@/app/lib/dbConnect";
import { verifyvalidation } from "@/app/schemas/verifySchema";
import UserModel from "@/app/Models/User";
import { usernamevalidation } from "@/app/schemas/signupSchema";

// Define a schema that checks both `username` and `code`
const VerifyQuerySchema = z.object({
  username: usernamevalidation,
  code: verifyvalidation,
});

export async function POST(req: Request) {
  console.log("Received request at /api/verifycode");

  await dbConnect();

  try {
    // Parse and validate the request JSON body
    const { username, code } = await req.json();
console.log(username,code)
    // Check if the code meets schema requirements
    const result = VerifyQuerySchema.safeParse({ username, code:{code} });
    if (!result.success) {
      const codeErrors = result.error.format().code?._errors || [];
      console.log("Validation failed:", codeErrors);
      return new Response(
        JSON.stringify({ success: false, message: codeErrors.join(",") || "Invalid code" }),
        { status: 400 }
      );
    }

    console.log("Valid data, checking user in DB...");
    const user = await UserModel.findOne({ username });
    if (!user) {
      console.log("User not found");
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    // Check if the code matches and if it has expired
    const isCodeExpired = new Date() >= new Date(user.verifyExpires);
    if (user.verifyCode !== code) {
      console.log("Invalid code");
      return new Response(
        JSON.stringify({ success: false, message: "Invalid code" }),
        { status: 400 }
      );
    }
    if (isCodeExpired) {
      console.log("Code expired");
      return new Response(
        JSON.stringify({ success: false, message: "Code expired" }),
        { status: 400 }
      );
    }

    // Update the user's verified status and save
    user.verified = true;
    await user.save();

    console.log("User verified successfully");
    return new Response(
      JSON.stringify({ success: true, message: "User verified successfully" }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error during verification:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Verification failed" }),
      { status: 500 }
    );
  }
}
