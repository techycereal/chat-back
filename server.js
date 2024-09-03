const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const axios = require('axios');
const admin = require('./firebaseConfig');
const cors = require('cors')
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
require('dotenv').config()
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors())
// Firebase API key
const FIREBASE_API_KEY = process.env.API_KEY;
const groupClients = {};
const PORT = process.env.PORT || 5000

// Middleware to validate Firebase ID tokens
const validateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Authentication Routes
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`, {
      email,
      password,
      returnSecureToken: true,
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ message: error.response?.data?.error?.message || 'Sign up failed' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`, {
      email,
      password,
      returnSecureToken: true,
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ message: error.response?.data?.error?.message || 'Login failed' });
  }
});

// Protected Route Example
app.get('/protected', validateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// WebSocket Setup
wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    const msg = JSON.parse(message);

    if (msg.action === 'join') {
      const group = msg.group;
      if (!groupClients[group]) {
        groupClients[group] = new Set();
      }
      groupClients[group].add(ws);
      console.log(`Client joined group ${group}`);
    } else if (msg.action === 'typing') {
      const group = msg.group;
      if (groupClients[group]) {
        groupClients[group].forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ action: 'typing', group, user: msg.user }));
          }
        });
      }
    } else if (msg.group && msg.text) {
      const group = msg.group;
      if (groupClients[group]) {
        groupClients[group].forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(msg));
          }
        });

        // Save the message to Firestore
        try {
          await db.collection('groups').doc(group).collection('messages').add({
            text: msg.text,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          });
        } catch (error) {
          console.error('Error saving message:', error.message);
        }
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    for (const group in groupClients) {
      groupClients[group].delete(ws);
    }
  });
});


// Start Server
server.listen(PORT, () => {
  console.log('Server is listening on port 5000');
});
