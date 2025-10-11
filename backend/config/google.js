import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

console.log('--- Checking Google OAuth Environment Variables ---');
console.log('GOOGLE_CLIENT_ID Loaded:', !!process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET Loaded:', !!process.env.GOOGLE_CLIENT_SECRET);
console.log('GOOGLE_REDIRECT_URI Loaded:', !!process.env.GOOGLE_REDIRECT_URI);
console.log('----------------------------------------------------');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export default oauth2Client;
