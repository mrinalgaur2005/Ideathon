import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    console.log('Sending email to:', email);  // Log the email address
    console.log('Verification code:', verifyCode);  // Log the verification code

    const response = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>' , // Ensure this is a valid, verified sender email
      to: email,
      subject: 'Verification Code for CollegeCompass',
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    console.log('Email sent response:', response);  // Log the response to check if the email was successfully sent

    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}
