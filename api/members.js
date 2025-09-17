const express = require('express');
const { Member } = require('../database');
const { authenticateJWT } = require('../auth');

const router = express.Router();

// Get all members (public route)
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all members...');
    const members = await Member.findAll({
      order: [['createdAt', 'DESC']] // Order by newest first
    });
    console.log(`Found ${members.length} members`);
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Get single member by ID (public route)
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: 'Failed to fetch member' });
  }
});

// Create new member (admin only)
router.post('/', authenticateJWT, async (req, res) => {
  try {
    console.log('=== CREATE MEMBER DEBUG ===');
    console.log('User from JWT:', req.user);
    console.log('Request body:', req.body);
    
    const { name, age, major, role, description, picture } = req.body;

    // Validate required fields
    if (!name || !age || !major || !role || !description) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, age, major, role, and description are required' 
      });
    }

    const member = await Member.create({
      name: name.toString().trim(),
      age: age.toString().trim(),
      major: major.toString().trim(),
      role: role.toString().trim(),
      description: description.toString().trim(),
      picture: picture?.toString().trim() || null
    });

    console.log('Member created successfully:', member.toJSON());
    res.status(201).json(member);
  } catch (error) {
    console.error('Error creating member:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ error: 'Failed to create member' });
  }
});

// Update member (admin only)
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    console.log('=== UPDATE MEMBER DEBUG ===');
    console.log('User from JWT:', req.user);
    console.log('Member ID:', req.params.id);
    console.log('Request body:', req.body);
    
    const { name, age, major, role, description, picture } = req.body;
    
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    await member.update({
      name: name ? name.toString().trim() : member.name,
      age: age ? age.toString().trim() : member.age,
      major: major ? major.toString().trim() : member.major,
      role: role ? role.toString().trim() : member.role,
      description: description ? description.toString().trim() : member.description,
      picture: picture ? picture.toString().trim() : member.picture
    });

    console.log('Member updated successfully');
    res.json(member);
  } catch (error) {
    console.error('Error updating member:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ error: 'Failed to update member' });
  }
});

// Delete member (admin only)
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    console.log('=== DELETE MEMBER DEBUG ===');
    console.log('User from JWT:', req.user);
    console.log('Member ID:', req.params.id);
    
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    await member.destroy();
    console.log('Member deleted successfully');
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

module.exports = router;