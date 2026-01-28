import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "Active",
                required: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
                const info = await transporter.sendMail({
                    from: '"prisma blog" <prismablog@ph.com>',
                    to: user.email,
                    subject: "Hello ✔",
                    text: "Hello world?",
                    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    h2 {
      color: #333333;
    }
    p {
      font-size: 16px;
      color: #555555;
      line-height: 1.5;
    }
    .btn {
      display: inline-block;
      padding: 12px 25px;
      margin-top: 20px;
      font-size: 16px;
      color: #ffffff;
      background-color: #34C759; /* Your green color */
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #888888;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Verify Your Email Address</h2>
    <p>Hi ${user.email}</p>
    <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
    <a href="${verificationUrl}" class="btn">Verify Email</a>
    <p>If the button above does not work, copy and paste the following link into your browser:</p>
    <p><a href="${verificationUrl}">${verificationUrl}</a></p>
    <div class="footer">
      <p>If you did not sign up for this account, you can safely ignore this email.</p>
    </div>
  </div>
</body>
</html>
`,
                });

                console.log("Message Sent", info.messageId);
            } catch (err) {
                console.error(err);
                throw err;
            }
        },
    },
});