const express = require('express');
const PasswordEntry = require('../models/PasswordEntry');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all password entries for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const passwordEntries = await PasswordEntry.find({ userId: req.user._id })
      .sort({ lastUpdated: -1 });

    // Decrypt passwords for display
    const decryptedEntries = passwordEntries.map(entry => {
      const entryObj = entry.toObject();
      entryObj.password = entry.decryptPassword();
      return entryObj;
    });

    res.json({
      success: true,
      data: {
        passwords: decryptedEntries,
        count: decryptedEntries.length
      }
    });

  } catch (error) {
    console.error('Get passwords error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching password entries',
      error: error.message
    });
  }
});

// Get password entry by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const passwordEntry = await PasswordEntry.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!passwordEntry) {
      return res.status(404).json({
        success: false,
        message: 'Password entry not found'
      });
    }

    // Decrypt password for display
    const entryObj = passwordEntry.toObject();
    entryObj.password = passwordEntry.decryptPassword();

    res.json({
      success: true,
      data: {
        password: entryObj
      }
    });

  } catch (error) {
    console.error('Get password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching password entry',
      error: error.message
    });
  }
});

// Create new password entry
router.post('/', auth, async (req, res) => {
  try {
    const { title, username, password, website, category, notes } = req.body;

    // Validate required fields
    if (!title || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Title, username, and password are required'
      });
    }

    const newPasswordEntry = new PasswordEntry({
      userId: req.user._id,
      title,
      username,
      password,
      website: website || '',
      category: category || 'General',
      notes: notes || ''
    });

    await newPasswordEntry.save();

    // Decrypt password for response
    const entryObj = newPasswordEntry.toObject();
    entryObj.password = newPasswordEntry.decryptPassword();

    res.status(201).json({
      success: true,
      message: 'Password entry created successfully',
      data: {
        password: entryObj
      }
    });

  } catch (error) {
    console.error('Create password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating password entry',
      error: error.message
    });
  }
});

// Update password entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, username, password, website, category, notes } = req.body;

    const passwordEntry = await PasswordEntry.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!passwordEntry) {
      return res.status(404).json({
        success: false,
        message: 'Password entry not found'
      });
    }

    // Update fields
    if (title) passwordEntry.title = title;
    if (username) passwordEntry.username = username;
    if (password) passwordEntry.password = password;
    if (website !== undefined) passwordEntry.website = website;
    if (category) passwordEntry.category = category;
    if (notes !== undefined) passwordEntry.notes = notes;

    passwordEntry.lastUpdated = new Date();
    await passwordEntry.save();

    // Decrypt password for response
    const entryObj = passwordEntry.toObject();
    entryObj.password = passwordEntry.decryptPassword();

    res.json({
      success: true,
      message: 'Password entry updated successfully',
      data: {
        password: entryObj
      }
    });

  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating password entry',
      error: error.message
    });
  }
});

// Delete password entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const passwordEntry = await PasswordEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!passwordEntry) {
      return res.status(404).json({
        success: false,
        message: 'Password entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Password entry deleted successfully'
    });

  } catch (error) {
    console.error('Delete password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting password entry',
      error: error.message
    });
  }
});

// Get password entries by category
router.get('/category/:category', auth, async (req, res) => {
  try {
    const passwordEntries = await PasswordEntry.find({
      userId: req.user._id,
      category: req.params.category
    }).sort({ lastUpdated: -1 });

    // Decrypt passwords for display
    const decryptedEntries = passwordEntries.map(entry => {
      const entryObj = entry.toObject();
      entryObj.password = entry.decryptPassword();
      return entryObj;
    });

    res.json({
      success: true,
      data: {
        passwords: decryptedEntries,
        count: decryptedEntries.length,
        category: req.params.category
      }
    });

  } catch (error) {
    console.error('Get passwords by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching password entries by category',
      error: error.message
    });
  }
});

// Search password entries
router.get('/search/:query', auth, async (req, res) => {
  try {
    const query = req.params.query;
    const passwordEntries = await PasswordEntry.find({
      userId: req.user._id,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
        { website: { $regex: query, $options: 'i' } },
        { notes: { $regex: query, $options: 'i' } }
      ]
    }).sort({ lastUpdated: -1 });

    // Decrypt passwords for display
    const decryptedEntries = passwordEntries.map(entry => {
      const entryObj = entry.toObject();
      entryObj.password = entry.decryptPassword();
      return entryObj;
    });

    res.json({
      success: true,
      data: {
        passwords: decryptedEntries,
        count: decryptedEntries.length,
        query: query
      }
    });

  } catch (error) {
    console.error('Search passwords error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching password entries',
      error: error.message
    });
  }
});

module.exports = router;
