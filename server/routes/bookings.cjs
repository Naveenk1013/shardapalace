const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const { status, date } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (date) {
      const searchDate = new Date(date);
      where.OR = [
        { checkIn: { lte: searchDate }, checkOut: { gte: searchDate } },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: { 
        guest: true, 
        room: { include: { roomType: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// GET single booking
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: { 
        guest: true, 
        room: { include: { roomType: true } },
        items: true,
      },
    });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// POST create booking
router.post('/', async (req, res) => {
  try {
    const { guestId, roomId, checkIn, checkOut, totalAmount, paidAmount } = req.body;
    
    if (!guestId || !checkIn || !checkOut) {
      return res.status(400).json({ error: 'Guest, check-in and check-out dates are required' });
    }

    // Calculate nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ error: 'Check-out must be after check-in' });
    }

    // Check room availability if room is specified
    if (roomId) {
      const conflictingBooking = await prisma.booking.findFirst({
        where: {
          roomId: parseInt(roomId),
          status: { in: ['CONFIRMED', 'CHECKED_IN'] },
          OR: [
            {
              checkIn: { lte: checkOutDate },
              checkOut: { gte: checkInDate },
            },
          ],
        },
      });

      if (conflictingBooking) {
        return res.status(400).json({ error: 'Room is not available for these dates' });
      }
    }

    const booking = await prisma.booking.create({
      data: {
        guestId: parseInt(guestId),
        roomId: roomId ? parseInt(roomId) : null,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalAmount: parseFloat(totalAmount) || 0,
        paidAmount: parseFloat(paidAmount) || 0,
        status: 'CONFIRMED',
      },
      include: { guest: true, room: { include: { roomType: true } } },
    });
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// PUT update booking
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { roomId, checkIn, checkOut, totalAmount, paidAmount, status } = req.body;

    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: {
        ...(roomId !== undefined && { roomId: roomId ? parseInt(roomId) : null }),
        ...(checkIn && { checkIn: new Date(checkIn) }),
        ...(checkOut && { checkOut: new Date(checkOut) }),
        ...(totalAmount !== undefined && { totalAmount: parseFloat(totalAmount) }),
        ...(paidAmount !== undefined && { paidAmount: parseFloat(paidAmount) }),
        ...(status && { status }),
      },
      include: { guest: true, room: { include: { roomType: true } } },
    });
    res.json(booking);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Booking not found' });
    }
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// PATCH check-in
router.patch('/:id/check-in', async (req, res) => {
  try {
    const { id } = req.params;
    const { roomId } = req.body;

    // Get booking first
    const existingBooking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (existingBooking.status !== 'CONFIRMED') {
      return res.status(400).json({ error: 'Only confirmed bookings can be checked in' });
    }

    const finalRoomId = roomId ? parseInt(roomId) : existingBooking.roomId;
    if (!finalRoomId) {
      return res.status(400).json({ error: 'Room must be assigned for check-in' });
    }

    // Update booking and room status
    const [booking] = await prisma.$transaction([
      prisma.booking.update({
        where: { id: parseInt(id) },
        data: { 
          status: 'CHECKED_IN',
          roomId: finalRoomId,
        },
        include: { guest: true, room: { include: { roomType: true } } },
      }),
      prisma.room.update({
        where: { id: finalRoomId },
        data: { status: 'OCCUPIED' },
      }),
    ]);

    res.json(booking);
  } catch (error) {
    console.error('Error checking in:', error);
    res.status(500).json({ error: 'Failed to check in' });
  }
});

// PATCH check-out
router.patch('/:id/check-out', async (req, res) => {
  try {
    const { id } = req.params;

    const existingBooking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: { room: true },
    });

    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (existingBooking.status !== 'CHECKED_IN') {
      return res.status(400).json({ error: 'Only checked-in bookings can be checked out' });
    }

    // Update booking and room status
    const [booking] = await prisma.$transaction([
      prisma.booking.update({
        where: { id: parseInt(id) },
        data: { status: 'CHECKED_OUT' },
        include: { guest: true, room: { include: { roomType: true } } },
      }),
      prisma.room.update({
        where: { id: existingBooking.roomId },
        data: { status: 'DIRTY' },
      }),
    ]);

    res.json(booking);
  } catch (error) {
    console.error('Error checking out:', error);
    res.status(500).json({ error: 'Failed to check out' });
  }
});

// DELETE (cancel) booking
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingBooking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (existingBooking.status === 'CHECKED_IN') {
      return res.status(400).json({ error: 'Cannot cancel a checked-in booking. Check out first.' });
    }

    await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status: 'CANCELLED' },
    });
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;
