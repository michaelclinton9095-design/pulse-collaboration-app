const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { seedPulseIfEmpty } = require('./utils/seedData');
const authRoutes = require('./routes/authRoutes');
const channelRoutes = require('./routes/channelRoutes');
const messageRoutes = require('./routes/messageRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const Message = require('./models/Message');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);

// Dynamic CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Pulse Real-Time Messaging API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    connectedSockets: io.engine ? io.engine.clientsCount : 0,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// REST API routes
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('[Pulse Backend Error]:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Socket.IO server initialization
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Real-Time Socket.IO Handlers
io.on('connection', (socket) => {
  // Join Channel Room
  socket.on('channel:join', (roomId) => {
    socket.join(roomId);
  });

  // Leave Channel Room
  socket.on('channel:leave', (roomId) => {
    socket.leave(roomId);
  });

  // Send Message with database persistence before broadcast
  socket.on('message:send', async (messageData, ack) => {
    try {
      const { roomId, sender, text, audioUrl, audioDuration, fileUrl, fileName, fileSize } = messageData;

      if (!roomId || !sender) {
        if (typeof ack === 'function') ack({ status: 'error', error: 'Missing room or sender' });
        return;
      }

      const newMsg = new Message({
        roomId,
        sender,
        text: text ? text.trim() : '',
        audioUrl,
        audioDuration,
        fileUrl,
        fileName,
        fileSize,
        createdAt: new Date()
      });

      await newMsg.save();

      // Broadcast to room
      io.to(roomId).emit('message:new', newMsg);

      if (typeof ack === 'function') {
        ack({ status: 'ok', message: newMsg });
      }
    } catch (err) {
      console.error('[Socket.IO] Message save error:', err);
      if (typeof ack === 'function') {
        ack({ status: 'error', error: err.message });
      }
    }
  });

  // Typing indicators
  socket.on('typing:start', ({ roomId, user }) => {
    socket.to(roomId).emit('typing:start', { roomId, user });
  });

  socket.on('typing:stop', ({ roomId, user }) => {
    socket.to(roomId).emit('typing:stop', { roomId, user });
  });

  // Real-time presence updates
  socket.on('presence:update', async ({ userId, status }) => {
    if (userId && userId.match(/^[0-9a-fA-F]{24}$/)) {
      await User.findByIdAndUpdate(userId, { status, lastSeen: new Date() }).catch(() => {});
    }
    io.emit('presence:update', { userId, status });
  });

  socket.on('disconnect', () => {
    // Socket disconnected
  });
});

// Resilient MongoDB connection & auto-seeding
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pulse';
mongoose
  .connect(mongoUri, { serverSelectionTimeoutMS: 3000 })
  .then(async () => {
    console.log(`✅ [Pulse Backend] MongoDB connected successfully to ${mongoUri}`);
    await seedPulseIfEmpty();
  })
  .catch((err) => {
    console.warn(`[Pulse Backend] MongoDB connection warning: ${err.message}`);
  });

const PORT = process.env.PORT || 5002;
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Pulse Real-Time Messaging API running at http://localhost:${PORT}`);
  });
}

module.exports = { app, server, io };
