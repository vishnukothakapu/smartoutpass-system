const express = require('express');
const GateLog = require('../models/GateLog');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

/**
 * GET /api/logs
 * Security and Warden can view all gate logs
 */
router.get('/', authorize('security', 'warden'), async (req, res) => {
  try {
    const logs = await GateLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch logs.' });
  }
});

/**
 * POST /api/logs
 * Security logs an entry or exit event
 * Body: { outpassId, studentName, studentId, type: 'entry' | 'exit' }
 */
router.post('/', authorize('security'), async (req, res) => {
  const { outpassId, studentName, studentId, type } = req.body;

  if (!outpassId || !type) {
    return res.status(400).json({ message: 'outpassId and type are required.' });
  }

  if (!['entry', 'exit'].includes(type)) {
    return res.status(400).json({ message: "type must be 'entry' or 'exit'." });
  }

  try {
    const log = await GateLog.create({
      outpassId,
      studentName,
      studentId,
      type,
      loggedBy: req.user._id,
      timestamp: new Date(),
    });
    res.status(201).json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create log.' });
  }
});

module.exports = router;
