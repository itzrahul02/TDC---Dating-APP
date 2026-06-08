import express from 'express';
import Profile from '../models/Profile.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all clients (isClient: true)
router.get('/clients', auth, async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = { isClient: true };

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    const clients = await Profile.find(filter).sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get client stats
router.get('/clients/stats', auth, async (req, res) => {
  try {
    const total = await Profile.countDocuments({ isClient: true });
    const searching = await Profile.countDocuments({ isClient: true, status: 'Searching' });
    const introSent = await Profile.countDocuments({ isClient: true, status: 'Intro Sent' });
    const matched = await Profile.countDocuments({ isClient: true, status: 'Matched' });

    res.json({ total, searching, introSent, matched });
  } catch (error) {
    res.status(500).json({ message: 'Server error' }); 
  }
}); 

// Get single client by profileId
router.get('/clients/:id', auth, async (req, res) => {
  try {
    const client = await Profile.findOne({ profileId: req.params.id, isClient: true });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) { 
    res.status(500).json({ message: 'Server error' });
  }
});

// Update client status and notes
router.patch('/clients/:id', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const update = {};
    if (status) update.status = status;
    if (notes !== undefined) update.notes = notes;

    const client = await Profile.findOneAndUpdate(
      { profileId: req.params.id, isClient: true },
      update,
      { new: true }
    );
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pool profiles (for matching)
router.get('/pool', auth, async (req, res) => {
  try {
    const pool = await Profile.find({ isClient: false });
    res.json(pool);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
