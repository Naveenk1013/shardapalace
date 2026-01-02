const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET all guests
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    
    const where = search ? {
      OR: [
        { name: { contains: search } },
        { mobile: { contains: search } },
        { email: { contains: search } },
      ],
    } : {};

    const guests = await prisma.guest.findMany({
      where,
      include: { _count: { select: { bookings: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(guests);
  } catch (error) {
    console.error('Error fetching guests:', error);
    res.status(500).json({ error: 'Failed to fetch guests' });
  }
});

// GET single guest
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const guest = await prisma.guest.findUnique({
      where: { id: parseInt(id) },
      include: { bookings: { include: { room: true }, orderBy: { createdAt: 'desc' } } },
    });
    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    res.json(guest);
  } catch (error) {
    console.error('Error fetching guest:', error);
    res.status(500).json({ error: 'Failed to fetch guest' });
  }
});

// POST create guest
router.post('/', async (req, res) => {
  try {
    const { name, mobile, email, address, idType, idNumber } = req.body;
    
    if (!name || !mobile) {
      return res.status(400).json({ error: 'Name and mobile are required' });
    }

    const guest = await prisma.guest.create({
      data: { name, mobile, email, address, idType, idNumber },
    });
    res.status(201).json(guest);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Mobile number already registered' });
    }
    console.error('Error creating guest:', error);
    res.status(500).json({ error: 'Failed to create guest' });
  }
});

// PUT update guest
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, email, address, idType, idNumber } = req.body;

    const guest = await prisma.guest.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(mobile && { mobile }),
        ...(email !== undefined && { email }),
        ...(address !== undefined && { address }),
        ...(idType !== undefined && { idType }),
        ...(idNumber !== undefined && { idNumber }),
      },
    });
    res.json(guest);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Guest not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Mobile number already registered' });
    }
    console.error('Error updating guest:', error);
    res.status(500).json({ error: 'Failed to update guest' });
  }
});

// DELETE guest
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check for active bookings
    const bookingCount = await prisma.booking.count({
      where: { 
        guestId: parseInt(id),
        status: { in: ['CONFIRMED', 'CHECKED_IN'] },
      },
    });
    
    if (bookingCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete: Guest has ${bookingCount} active booking(s)` 
      });
    }

    await prisma.guest.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Guest deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Guest not found' });
    }
    console.error('Error deleting guest:', error);
    res.status(500).json({ error: 'Failed to delete guest' });
  }
});

module.exports = router;
