import { resend } from "../lib/resent";
import VerficationEmailTemplate from "./VerificationEmailTemplate";
import { ApiResponse } from "../types/ApiResponse";
import { verifyvalidation } from "../schemas/verifySchema";

export async function SendVerificationEmail(verifyCode:string,username:string,email:string):Promise<ApiResponse>{
try {
    console.log("sender email :", process.env.SENDER_EMAIL || 'onboarding@resend.dev');

    const { data, error } = await resend.emails.send({
        from: process.env.SENDER_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: 'unknownfeedback! Verify Your Identity',
        react: VerficationEmailTemplate({
            username,
            otp: verifyCode
        }),
      });
      if(error){
      return { success: false, message: error.message };
      }
      return { success: true, message: "Verification email sent successfully" };
  
} catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Error sending verification email" };
}
}