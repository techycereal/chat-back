// firebaseConfig.js
const admin = require('firebase-admin');
require('dotenv').config();

const PRIVATE_KEY_ID = process.env.PRIVATE_KEY_ID
const PRIVATE_KEY = process.env.PRIVATE_KEY
const CLIENT_ID = process.env.CLIENT_ID  
console.log('PRIVATE_KEY:', process.env.PRIVATE_KEY ? 'Exists' : 'Missing');
console.log('PRIVATE_KEY_ID:', process.env.PRIVATE_KEY_ID);
console.log('CLIENT_ID:', process.env.CLIENT_ID);

const serviceAccount = { 
    "type": "service_account",
    "project_id": "chatapp-e26b8",
    "private_key_id": PRIVATE_KEY_ID,
    "private_key": PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": "firebase-adminsdk-ons6m@chatapp-e26b8.iam.gserviceaccount.com",
    "client_id": CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ons6m%40chatapp-e26b8.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
  
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
