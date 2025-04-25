require('dotenv').config();


const serverPort = process.env.SERVER_PORT || 4001;
const fileSize = process.env.FILE_SIZE || 2097152;
const fileType = process.env.FILE_TYPE || ['jpg','jpeg','png'];
const mongodbURL = process.env.MONGODB_DATABASE || 'mongodb://localhost:27017/ecommerceMern';
const defaultImagePath = process.env.DEFAULT_IMAGE_PATH || '../public/image/user/default.png';
const smtpUsername = process.env.SMTP_USERNAME || '';
const smtpPassword = process.env.SMTP_PASSWORD || '';
const clientUrl = process.env.CLIENT_URL;
module.exports = {serverPort, mongodbURL, defaultImagePath, smtpUsername, smtpPassword, clientUrl, fileSize, fileType}