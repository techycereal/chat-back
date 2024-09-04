const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const admin = require('./firebaseConfig');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust this for more secure CORS configuration in production
    methods: ["GET", "POST"]
  }
});

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Firebase API key
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const groupClients = {};
const PORT = process.env.PORT || 5000;

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

app.use(validateToken);

// Fetch User Profile Route
app.get('/user-profile', async (req, res) => {
  const userId = req.user.uid;

  try {
    // Fetch user document
    const userDocRef = admin.firestore().collection('users').doc(userId);
    const userDoc = await userDocRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      const username = userData.username || '';

      // Fetch pending invitations
      const invitationsQuery = admin.firestore().collection('invitations')
        .where('invitee', '==', username)
        .where('status', '==', 'pending');

      const invitationSnapshot = await invitationsQuery.get();
      const fetchedInvitations = invitationSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Send response with user data and pending invitations
      res.status(200).json({
        username,
        invitations: fetchedInvitations,
      });
    } else {
      res.status(404).json({ message: 'User document not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

app.post('/invite-to-group', async (req, res) => {
  const { usernameToInvite, group, username } = req.body;
  const inviter = req.user.uid;  // The UID of the logged-in user who is sending the invitation

  if (usernameToInvite && group) {
    try {
      const usersRef = admin.firestore().collection('users');
      const q = usersRef.where('username', '==', usernameToInvite);
      const querySnapshot = await q.get();

      if (!querySnapshot.empty) {
        // Generate a unique invitation ID
        const invitationId = `${usernameToInvite}-${inviter}-${group}`;
        const invitationRef = admin.firestore().doc(`invitations/${invitationId}`);
        const invitationSnapshot = await invitationRef.get();

        if (!invitationSnapshot.exists) {
          await invitationRef.set({
            group,
            invitee: usernameToInvite,
            inviter: username,  // Here you might want to store the username instead of UID if needed
            status: 'pending',
          });
          res.status(200).json({ message: 'User invited successfully!' });
        } else {
          res.status(400).json({ message: 'Invitation already exists.' });
        }
      } else {
        res.status(404).json({ message: 'User not found!' });
      }
    } catch (error) {
      console.error('Error inviting user:', error.message);
      res.status(500).json({ message: 'Error inviting user' });
    }
  } else {
    res.status(400).json({ message: 'Username and group are required' });
  }
});

// Create Group Route
app.post('/create-group', async (req, res) => {
  const { groupName, username } = req.body;
  
  if (groupName) {
    try {
      const groupRef = admin.firestore().doc(`groups/${groupName}`);
      await groupRef.set({ members: [username], creator: username });
      
      // Add group to user's list
      const userRef = admin.firestore().doc(`users/${req.user.uid}`);
      await userRef.update({ groups: admin.firestore.FieldValue.arrayUnion(groupName) });
      
      res.status(200).json({ message: 'Group created successfully!' });
    } catch (error) {
      console.error('Error creating group:', error.message);
      res.status(500).json({ message: 'Error creating group' });
    }
  } else {
    res.status(400).json({ message: 'Group name is required' });
  }
});

// Fetch User Groups Route
app.get('/my-groups', async (req, res) => {
  try {
    const userRef = admin.firestore().doc(`users/${req.user.uid}`);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      const username = userData.username || 'Anonymous';
      const userGroups = userData.groups || [];
      
      res.json({ username, groups: userGroups });
    } else {
      res.status(404).json({ message: 'User document not found' });
    }
  } catch (error) {
    console.error('Error fetching user groups:', error.message);
    res.status(500).json({ message: 'Error fetching user groups' });
  }
});

app.post('/signup', async (req, res) => {
  const { user, username, email } = req.body;

  try {
    // Save additional user info to Firestore
    await admin.firestore().doc(`users/${user.uid}`).set({
      username,
      email,
    });

    res.status(201).send({ message: 'User signed up successfully!' });
  } catch (error) {
    console.error('Error saving user info to Firestore:', error.message);
    res.status(500).send({ error: 'Failed to save user info to Firestore' });
  }
});

// Protected Route Example
app.get('/protected', (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Socket.IO Setup
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', (group) => {
    if (!groupClients[group]) {
      groupClients[group] = new Set();
    }
    groupClients[group].add(socket);
    console.log(`Client joined group ${group}`);
  });

  socket.on('typing', (data) => {
    const { group, user } = data;
    if (groupClients[group]) {
      groupClients[group].forEach(client => {
        if (client !== socket) {
          client.emit('typing', { group, user });
        }
      });
    }
  });

  socket.on('message', async (data) => {
    const { group, text } = data;
    if (groupClients[group]) {
      groupClients[group].forEach(client => {
        if (client !== socket) {
          client.emit('message', data);
        }
      });

      // Save the message to Firestore
      try {
        await admin.firestore().collection('groups').doc(group).collection('messages').add({
          text,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (error) {
        console.error('Error saving message:', error.message);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    for (const group in groupClients) {
      groupClients[group].delete(socket);
    }
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
