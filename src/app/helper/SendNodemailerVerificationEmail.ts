import { transporter } from "../lib/nodemailer";
import { ApiResponse } from "../types/ApiResponse";
import { renderToStaticMarkup } from "react-dom/server";
import VerficationEmailTemplate from "./VerificationEmailTemplate";

export const SendNodemailerVerificationEmail = async (
  verifyCode: string,
  username: string,
  email: string
): Promise<ApiResponse> => {
  try {

    const html = `
    <div style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; background-color: #ffffff; line-height: 1.5;">
      <div style="background-color: #ffffff; border: 1px solid #eee; border-radius: 5px; box-shadow: 0 5px 10px rgba(20,50,70,.2); margin-top: 20px; max-width: 360px; margin: 0 auto; padding: 68px 0 130px;">
        <img src="https://i.ibb.co/NVgYmPr/Screenshot-2024-12-08-094641.png" width="100%" height="auto" alt="Unknown Img" style="margin: 0 auto; object-fit: contain;" />
        <p style="color: #0a85ea; font-size: 11px; font-weight: 700; text-transform: uppercase; text-align: center; margin: 16px 8px 8px 8px;">Verify Your Identity ${username}</p>
        <h1 style="color: #000; font-family: HelveticaNeue-Medium, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 500; text-align: center;">Thank you! for registering with 'UnknownFeedback' here is your OTP:</h1>
        <div style="background: rgba(0,0,0,.05); border-radius: 4px; margin: 16px auto 14px; width: 280px; text-align: center;">
          <p style="color: #000; font-family: HelveticaNeue-Bold; font-size: 32px; font-weight: 700; letter-spacing: 6px; line-height: 40px; padding: 8px 0;">${verifyCode}</p>
        </div>
        <p style="color: #444; font-size: 15px; text-align: center; padding: 0 40px;">Not expecting this email?</p>
        <p style="color: #444; font-size: 15px; text-align: center;">
          Contact <a href="mailto:login@plaid.com" style="color: #444; text-decoration: underline;">login@plaid.com</a> if you did not request this code.
        </p>
      </div>
      <p style="color: #000; font-size: 12px; font-weight: 800; text-align: center; text-transform: uppercase; margin-top: 20px;">Securely powered by UnknownFeedback.</p>
    </div>
  `;
  
  


    // Send the email using Nodemailer
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: "UnknownFeedback! Verify Your Identity",
      html,
    });
if(!info.response){
    return { success: false, message: "Error sending verification email" };
}
    console.log("Email sent successfully:", info.messageId);//Email sent successfully: <d4a88412-d3c1-8de7-03f9-8391d7cbbb94@gmail.com>
    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Error sending verification email" };
  }
};
