import nodemailer from 'nodemailer';

export const transporter=nodemailer.createTransport({
    // service: 'gmail',
    host:process.env.SMTP_HOST,
    port:587,
    secure:false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false, // Avoid rejecting unauthorized certificates
      },
})
