var admin = require("firebase-admin");

const PRIVATE_KEY = process.env.PRIVATE_KEY
const PRIVATE_KEY_ID = process.env.PRIVATE_KEY_ID
const CLIENT_ID = process.env.CLIENT_ID

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "chatapp-e26b8",
    "private_key_id": PRIVATE_KEY_ID,
    "private_key": PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": "firebase-adminsdk-56umm@chatapp-e26b8.iam.gserviceaccount.com",
    "client_id": CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-56umm%40chatapp-e26b8.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
  )
});


module.exports = admin