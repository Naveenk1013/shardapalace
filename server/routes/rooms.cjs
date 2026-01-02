const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET all rooms
router.get('/', async (req, res) => {
  try {
    const { typeId, status } = req.query;
    
    const where = {};
    if (typeId) where.typeId = parseInt(typeId);
    if (status) where.status = status;

    const rooms = await prisma.room.findMany({
      where,
      include: { roomType: true },
      orderBy: [{ floor: 'asc' }, { number: 'asc' }],
    });
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// GET single room
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const room = await prisma.room.findUnique({
      where: { id: parseInt(id) },
      include: { roomType: true, bookings: { take: 5, orderBy: { createdAt: 'desc' } } },
    });
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// POST create room
router.post('/', async (req, res) => {
  try {
    const { number, floor, typeId, status } = req.body;
    
    if (!number || !typeId) {
      return res.status(400).json({ error: 'Room number and type are required' });
    }

    const room = await prisma.room.create({
      data: {
        number,
        floor: parseInt(floor) || 1,
        typeId: parseInt(typeId),
        status: status || 'VACANT',
      },
      include: { roomType: true },
    });
    res.status(201).json(room);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Room number already exists' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid room type' });
    }
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// PUT update room
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { number, floor, typeId, status } = req.body;

    const room = await prisma.room.update({
      where: { id: parseInt(id) },
      data: {
        ...(number && { number }),
        ...(floor && { floor: parseInt(floor) }),
        ...(typeId && { typeId: parseInt(typeId) }),
        ...(status && { status }),
      },
      include: { roomType: true },
    });
    res.json(room);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Room not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Room number already exists' });
    }
    console.error('Error updating room:', error);
    res.status(500).json({ error: 'Failed to update room' });
  }
});

// PATCH update room status only
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['VACANT', 'OCCUPIED', 'DIRTY', 'MAINTENANCE'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const room = await prisma.room.update({
      where: { id: parseInt(id) },
      data: { status },
      include: { roomType: true },
    });
    res.json(room);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Room not found' });
    }
    console.error('Error updating room status:', error);
    res.status(500).json({ error: 'Failed to update room status' });
  }
});

// DELETE room
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check for active bookings
    const bookingCount = await prisma.booking.count({
      where: { 
        roomId: parseInt(id),
        status: { in: ['CONFIRMED', 'CHECKED_IN'] },
      },
    });
    
    if (bookingCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete: Room has ${bookingCount} active booking(s)` 
      });
    }

    await prisma.room.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Room not found' });
    }
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

module.exports = router;
