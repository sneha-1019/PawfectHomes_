import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

console.log("SendGrid key present:", !!process.env.SENDGRID_API_KEY);


// Create transporter using SendGrid SMTP or Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});

// Send OTP email
export const sendOTPEmail = async (email, otp, name) => {
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Email Verification - Pawfect Home',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
          .header { text-align: center; color: #ff6b6b; margin-bottom: 20px; }
          .otp-box { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333; margin: 20px 0; }
          .footer { text-align: center; color: #777; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="header">🐾 Pawfect Home</h1>
          <p>Hi ${name},</p>
          <p>Thank you for registering with Pawfect Home! Use the following OTP to verify your email address:</p>
          <div class="otp-box">${otp}</div>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Pawfect Home. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully');
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    throw new Error('Email could not be sent');
  }
};

// Send adoption notification email
export const sendAdoptionNotification = async (email, petName, status) => {
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: `Adoption Update for ${petName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
          .header { text-align: center; color: #ff6b6b; }
          .status { padding: 15px; background: #d4edda; color: #155724; border-radius: 5px; margin: 20px 0; text-align: center; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="header">🐾 Pawfect Home</h1>
          <div class="status">Adoption Application ${status}</div>
          <p>Your adoption application for <strong>${petName}</strong> has been ${status.toLowerCase()}.</p>
          <p>Please log in to your dashboard for more details.</p>
          <p>Thank you for choosing Pawfect Home!</p>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending notification email:', error);
    // FIX: Added throw new Error to prevent silent failures
    throw new Error('Notification email could not be sent');
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Welcome to Pawfect Home! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
          .header { text-align: center; color: #ff6b6b; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="header">🐾 Welcome to Pawfect Home!</h1>
          <p>Hi ${name},</p>
          <p>Welcome to our pet adoption community! We're thrilled to have you join us in our mission to find loving homes for pets in need.</p>
          <p>You can now:</p>
          <ul>
            <li>Browse available pets</li>
            <li>Apply for adoption</li>
            <li>Upload pets for adoption</li>
            <li>Save your favorite pets</li>
          </ul>
          <p>Start exploring now and find your pawfect companion!</p>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // FIX: Added throw new Error to prevent silent failures
    throw new Error('Welcome email could not be sent');
  }
};

// Send contact form message to admin
export const sendContactFormEmail = async (name, fromEmail, subject, message) => {
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: process.env.ADMIN_EMAIL || process.env.FROM_EMAIL, 
    replyTo: fromEmail, 
    subject: `New Contact Form Message: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
          .header { color: #ff6b6b; margin-bottom: 20px; }
          .content-block { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
          .content-block p { margin: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="header">📬 New Message from Pawfect Home Contact Form</h1>
          <p>You have received a new message from a site visitor.</p>
          
          <div class="content-block">
            <strong>From:</strong>
            <p>${name} (${fromEmail})</p>
          </div>
          
          <div class="content-block">
            <strong>Subject:</strong>
            <p>${subject}</p>
          </div>

          <div class="content-block">
            <strong>Message:</strong>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p>You can reply directly to this email to respond to the user.</p>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Contact form email sent successfully');
  } catch (error) {
    console.error('❌ Error sending contact form email:', error);
    throw new Error('Email could not be sent');
  }
};