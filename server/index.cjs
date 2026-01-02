const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import middleware and routes
const authMiddleware = require('./middleware/authMiddleware.cjs');
const roomTypesRouter = require('./routes/roomTypes.cjs');
const roomsRouter = require('./routes/rooms.cjs');
const guestsRouter = require('./routes/guests.cjs');
const bookingsRouter = require('./routes/bookings.cjs');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

app.use(cors());
app.use(express.json());

// Health check (public)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hotel Sharda Palace PMS API is running' });
});

// Login Route (public)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: '8h' });

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected routes - require authentication
app.use('/api/room-types', authMiddleware, roomTypesRouter);
app.use('/api/rooms', authMiddleware, roomsRouter);
app.use('/api/guests', authMiddleware, guestsRouter);
app.use('/api/bookings', authMiddleware, bookingsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const start = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Connected to Database');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

start();

