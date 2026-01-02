const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET all room types
router.get('/', async (req, res) => {
  try {
    const roomTypes = await prisma.roomType.findMany({
      include: { _count: { select: { rooms: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(roomTypes);
  } catch (error) {
    console.error('Error fetching room types:', error);
    res.status(500).json({ error: 'Failed to fetch room types' });
  }
});

// GET single room type
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const roomType = await prisma.roomType.findUnique({
      where: { id: parseInt(id) },
      include: { rooms: true },
    });
    if (!roomType) {
      return res.status(404).json({ error: 'Room type not found' });
    }
    res.json(roomType);
  } catch (error) {
    console.error('Error fetching room type:', error);
    res.status(500).json({ error: 'Failed to fetch room type' });
  }
});

// POST create room type
router.post('/', async (req, res) => {
  try {
    const { name, basePrice, maxOccupancy } = req.body;
    
    if (!name || !basePrice) {
      return res.status(400).json({ error: 'Name and base price are required' });
    }

    const roomType = await prisma.roomType.create({
      data: {
        name,
        basePrice: parseFloat(basePrice),
        maxOccupancy: parseInt(maxOccupancy) || 2,
      },
    });
    res.status(201).json(roomType);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Room type name already exists' });
    }
    console.error('Error creating room type:', error);
    res.status(500).json({ error: 'Failed to create room type' });
  }
});

// PUT update room type
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, basePrice, maxOccupancy } = req.body;

    const roomType = await prisma.roomType.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(basePrice && { basePrice: parseFloat(basePrice) }),
        ...(maxOccupancy && { maxOccupancy: parseInt(maxOccupancy) }),
      },
    });
    res.json(roomType);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Room type not found' });
    }
    console.error('Error updating room type:', error);
    res.status(500).json({ error: 'Failed to update room type' });
  }
});

// DELETE room type
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if rooms exist for this type
    const roomCount = await prisma.room.count({
      where: { typeId: parseInt(id) },
    });
    
    if (roomCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete: ${roomCount} room(s) are using this type` 
      });
    }

    await prisma.roomType.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Room type deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Room type not found' });
    }
    console.error('Error deleting room type:', error);
    res.status(500).json({ error: 'Failed to delete room type' });
  }
});

module.exports = router;
