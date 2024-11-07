import { resend } from "../lib/resent";
import VerficationEmailTemplate from "./VerificationEmailTemplate";
import { ApiResponse } from "../types/ApiResponse";
import { verifyvalidation } from "../schemas/verifySchema";

export async function SendVerificationEmail(verifyCode:string,username:string,email:string):Promise<ApiResponse>{
try {
    const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'unknownfeedback! Verify Your Identity',
        react: VerficationEmailTemplate({
            username,
            otp: verifyCode
        }),
      });
      if(error){
      return { success: false, message: "Error sending verification email" };
      }
      return { success: true, message: "Verification email sent successfully" };
  
} catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Error sending verification email" };
}
}