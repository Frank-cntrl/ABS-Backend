const express = require('express');
const { Event } = require('../database');
const { authenticateJWT } = require('../auth');

const router = express.Router();

// Get all events (public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['date', 'ASC']]
    });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get single event (public)
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create new event (admin only)
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { title, description, location, date, image, rsvpLink } = req.body;

    const event = await Event.create({
      title,
      description,
      location,
      date: date || null,
      image: image || null,
      rsvpLink: rsvpLink || null
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event (admin only)
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const { title, description, location, date, image, rsvpLink } = req.body;
    
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await event.update({
      title,
      description,
      location,
      date: date || null,
      image: image || null,
      rsvpLink: rsvpLink || null
    });

    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event (admin only)
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;