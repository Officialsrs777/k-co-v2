import { transporter } from "../config/nodemailer.js";

export const sendVerificationEmail = async (email, full_name, otp) => {
  try {
    await transporter.sendMail({
      from: `"KandCo" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `
        <h3>Hello ${full_name}</h3>
        <p>Your verification code is:</p>
        <h2>${otp}</h2>
        <p>This code expires in 1 hour.</p>
      `
    });

    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, message: "Failed to send email" };
  }
};

