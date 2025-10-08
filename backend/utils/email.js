import nodemailer from 'nodemailer';

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
  }
};
