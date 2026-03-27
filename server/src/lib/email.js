import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (toEmail, otp) => {
  await transporter.sendMail({
    from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your verification code",
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
        <h2>Your verification code</h2>
        <p>Enter this code to sign in to ${process.env.APP_NAME}:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; 
                    padding: 20px; background: #f4f4f4; 
                    text-align: center; border-radius: 8px;">
          ${otp}
        </div>
        <p style="color: #666; margin-top: 16px;">
          This code expires in 15 minutes. If you didn't request this, ignore this email.
        </p>
      </div>
    `,
  });
};