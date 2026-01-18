// backend/routes/contact.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST route to submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('Missing required fields:', { name, email, subject, message });
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new contact message
    const contact = new Contact({ name, email, subject, message });
    await contact.save();

    console.log('Contact message saved:', { name, email, subject });
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Error saving contact message:', err.message);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router;