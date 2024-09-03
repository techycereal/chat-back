// firebaseConfig.js
const admin = require('firebase-admin');

const serviceAccount = {
    "type": "service_account",
    "project_id": "chatapp-e26b8",
    "private_key_id": "81a25616ac70adc107a1bb3a03a3ed22e632a0eb",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC4emhRPic/kUX0\nBv1m4swf9QEakb6xmyEveStKxT5SFt7gQ3vj2a9vVINsEQREn/rlQ1SauH/jdkik\nw9bUIPRlVxr2w0gyah2Jckjmk5RdQ7QZKQ5hPP1JbriXtkfnN/cAcBXJ0mNgU1tZ\nIjPdKKmzpPPuX8zWrqYgPhrgUXSte/76eYUpGirekwncYQbSDTV4WMFWqudaapsg\nVLQ3QtxY4LD+MUhgYutF8ZfnU/Poy9T8HxmHraKsrNr+SxbBSPEFi9VZZOpG2SKL\nCZZY7+7S6LGlj3xrCURyL3jHKkl/fn76grKhu9huZ+GgleO/b5fFuHr+YePI8x2U\nfly+xoW7AgMBAAECggEAAc4vpQSEZOSPiZ+yWaPh9usGJgySfGyks0Ta7K+jBx4G\nLtU6Pe/Y1py0W/I812DwNLwJpe5MUOJWsh/0OYKhDf11oQTroGyHSNuws+D8VGt9\nW+JLIeNCJXuGOghV4uNpLDLY7ZZpDy7kHwzjGkiu0vNpjeOESJxaL9xwqQy7pUjV\nOcT92DMeOHJyjSKQJzEYLr2t8c7/uBSQq8fIe/tvy7CfNWtvnfxyI5fWHCOeKZnG\nLpdYOtAaZCEvmxEOELLNi3rZI9OhVB/Qy049YAR6t0X64wRifHsSpu9l5Do8/+Jk\nVgkj2HjjSRaXnrQw/Fw88ShMj9pPkM1YFe8mIbATEQKBgQD9kG2qChMQ/yG2gcLt\niXgX5L6hI4aW3gSIX89BwJbSczJx9Kg25v7HlBAq/mYuMbcGXKARG39d0l3X3U3R\ntFog/mG9ARCY06d2x1gUkXg+gWoQ/GrEjbaVD6rjCzHBFYFb4rok9stg/AIx9okp\nmoWl0dZCvCLSYFoLNmFJ4HkOlwKBgQC6QBS6xrXweYy+bYP6fo0jC8Q41/JF7Fm8\n5FLdtcRh7tj+i3VAEOpCwCLw4Vyco8OIC4Nu9+4MopksSulKfcHEP4AvGk8wsitZ\nGEQeE5tw7HND2OaW+WCKWqNTgReqwJFnsk4JAI2T02fMYEELt1525DibTowuEhUv\nwxAXQzuKfQKBgQD4CwccJcrM/6eND5cOI0I1rXDF1SjeAMXSWlc27R0dNc+NJlY/\njuyBc9f1FvQCEGQIdyemVI3dy+I9PqHXmGPqjq4x5A7GUZYqXYtOY5eLHbISd7pC\nGJcZbkAu5k5/oXfv2PVbH4mIkD3dflxjNGO0+HZuxfgScGrlOQcm683AdQKBgADv\nW2tInhcz9QHruNLkGb9IStbiNqQlOJobJ1NXm0HGmi5E8vS8YQCuyD4fU4CxzcR8\nEk/XTMmhc1Vmlt853GQo0XLrFeSvsEoFNipUfN5HQZjgmN+/Jr3rEJDVwBGqX9B+\nc6fV6eAJGqdLAGiXphDAuowFC+0bSCHyP71uJ/ldAoGBAJtwKNfKMSDc9j9XeSKP\nhTCaaH0Qi3cA0CvE1epsEfxbWU/oBrQU/HQUE2KXtU0wwYNeHQzaQX2/nYHl8FSE\n7ManwYB4924gZ6qq4D/SZ935z+vE4gyH/Li9ug+bSTvamOlOJ/lIREonP4hMXqh7\nTvvZ1v7UDv9oJWKli0vrmFbd\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-ons6m@chatapp-e26b8.iam.gserviceaccount.com",
    "client_id": "109660384766219145472",
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
