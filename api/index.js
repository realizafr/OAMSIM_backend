// api/index.js

// Load environment variables immediately
require('dotenv').config();

const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser'); // REMOVED: express.json() handles this now
const path = require('path'); // Still needed for static paths, but see notes below

// IMPORTANT: Adjust paths for requiring your route files.
// Since api/index.js is now in 'api/' and your route folders
// (Login, Dashboard, etc.) are at the project root, you need '../'
const loginRoutes = require('../Login/loginRoutes');
const dashboardRoutes = require('../Dashboard/dashboardRoutes');
const applicationRoutes = require('../applicationForm/applicationRoutes');
const documentuploadRoutes = require('../documentUpload/documentuploadRoutes');
const applicationStatusRoutes = require('../applicationStatus/applicationStatusRoutes');
const messageRoutes = require('../messages/messageRoutes');
const paymentRoutes = require('../payment/paymentRoutes');

const app = express();

// Middleware:
// Enable CORS. IMPORTANT: For production, replace '*' with your actual frontend domain(s).
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // Use an env var for origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// app.use(bodyParser.json()); // REMOVED: Redundant with express.json()
app.use(express.json()); // For parsing JSON request bodies
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded bodies

// ATTENTION: Static file serving for '/uploads'
// This path.join(__dirname, 'uploads') will only work if 'uploads' is alongside api/index.js
// which is typically not the case. More importantly, serving user-uploaded files
// from serverless functions is NOT recommended.
// YOU SHOULD MIGRATE UPLOADS TO CLOUD OBJECT STORAGE (e.g., Vercel Blob, AWS S3).
// If 'uploads' are static files bundled with your *code*, they should be in 'public/' or referenced differently.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Register your routes.
// NOTE: These paths are relative to the root of your Express app,
// but Vercel's 'rewrites' in vercel.json will map '/api/*' to this app.
// So, a request to 'yourdomain.com/api/login' will hit 'app.use('/login', loginRoutes);'
app.use('/login', loginRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/application-form', applicationRoutes);
app.use('/document-upload', documentuploadRoutes);
app.use('/application-status', applicationStatusRoutes);
app.use('/messages', messageRoutes);
app.use('/payment', paymentRoutes);

// Make sure the path and filename are correct and match the actual file
const profileRoutes = require('../profile/profileRoutes'); // Adjusted path
app.use('/profile', profileRoutes);

// Export the Express app instance for Vercel
module.exports = app;