const express = require('express');
const Outpass = require('../models/Outpass');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes protected
router.use(protect);

/**
 * GET /api/outpasses
 * - Student: returns own outpasses
 * - Warden/Security: returns all outpasses (with optional ?status= filter)
 */
router.get('/', async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      query.studentId = req.user._id;
    } else if (req.user.role === 'warden') {
      const wHostel = req.user.hostel || '';
      const wWing = req.user.wing || '';
      
      let conditions = [];
      if (wHostel) {
        const hRegex = wHostel.replace(/[^a-zA-Z0-9]/g, '').split('').join('[^a-zA-Z0-9]*');
        conditions.push({ hostel: { $regex: new RegExp(`^${hRegex}$`, 'i') } });
      }
      if (wWing) {
        const wRegex = wWing.replace(/[^a-zA-Z0-9]/g, '').split('').join('[^a-zA-Z0-9]*');
        conditions.push({ wing: { $regex: new RegExp(`^${wRegex}$`, 'i') } });
      }

      if (conditions.length > 0) {
        query.$or = conditions;
      }
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const outpasses = await Outpass.find(query).sort({ appliedAt: -1 });
    res.json(outpasses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch outpasses.' });
  }
});

/**
 * GET /api/outpasses/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const outpass = await Outpass.findById(req.params.id).populate('studentId', 'mobile room');
    if (!outpass) return res.status(404).json({ message: 'Outpass not found.' });

    // Students can only see their own outpasses
    if (
      req.user.role === 'student' &&
      outpass.studentId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    // Merge populated student fields into the response
    const obj = outpass.toObject();
    obj.mobile = outpass.studentId?.mobile || '';
    obj.room   = outpass.studentId?.room   || '';
    obj.studentId = outpass.studentId?._id || outpass.studentId;

    res.json(obj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch outpass.' });
  }
});

/**
 * POST /api/outpasses
 * Student creates a new outpass request
 */
router.post('/', authorize('student'), async (req, res) => {
  const { reason, destination, items, dateOut, dateIn } = req.body;

  if (!reason || !destination || !dateOut || !dateIn) {
    return res.status(400).json({ message: 'Reason, destination, dateOut, and dateIn are required.' });
  }

  if (new Date(dateIn) <= new Date(dateOut)) {
    return res.status(400).json({ message: 'Return date must be after departure date.' });
  }

  // Validate student profile completeness
  const mandatoryFields = ['hostel', 'wing', 'room', 'mobile', 'fatherName', 'fatherMobile'];
  const missingFields = mandatoryFields.filter(field => !req.user[field] || req.user[field].trim() === '');
  
  if (missingFields.length > 0) {
    return res.status(400).json({ 
      message: 'Please complete your profile details (Hostel, Wing, Room, Mobile, Father\'s Name, Father\'s Mobile) before applying for an outpass.' 
    });
  }

  try {
    const existingOutpass = await Outpass.findOne({
      studentId: req.user._id,
      status: { $in: ['pending', 'approved', 'active'] }
    });

    if (existingOutpass) {
      return res.status(400).json({ 
        message: 'You already have an ongoing outpass. You cannot apply for a new one until it is completed or rejected.' 
      });
    }

    const outpass = await Outpass.create({
      studentId: req.user._id,
      studentName: req.user.name,
      studentProgram: req.user.program || '',
      studentBatch: req.user.batch || '',
      studentRollNo: req.user.rollNo || '',
      hostel: req.user.hostel || '',
      wing: req.user.wing || '',
      reason,
      destination,
      items: items || '',
      dateOut: new Date(dateOut),
      dateIn: new Date(dateIn),
      status: 'pending',
      appliedAt: new Date(),
    });

    res.status(201).json(outpass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create outpass.' });
  }
});

/**
 * PATCH /api/outpasses/:id/status
 * - Warden: can set => approved | rejected
 * - Security: can set => active (exit) | completed (entry)
 */
router.patch('/:id/status', authorize('warden', 'security'), async (req, res) => {
  const { status } = req.body;

  const wardenStatuses = ['approved', 'rejected'];
  const securityStatuses = ['active', 'completed'];

  if (req.user.role === 'warden' && !wardenStatuses.includes(status)) {
    return res.status(400).json({ message: 'Warden can only approve or reject.' });
  }
  if (req.user.role === 'security' && !securityStatuses.includes(status)) {
    return res.status(400).json({ message: 'Security can only set active or completed.' });
  }

  try {
    const outpass = await Outpass.findById(req.params.id);
    if (!outpass) return res.status(404).json({ message: 'Outpass not found.' });

    outpass.status = status;

    // Capture actual entry/exit times
    if (status === 'active' && !outpass.actualExitAt) {
      outpass.actualExitAt = new Date();
    } else if (status === 'completed' && !outpass.actualEntryAt) {
      outpass.actualEntryAt = new Date();
    }

    // Generate QR when approved
    if (status === 'approved') {
      outpass.qrData = Buffer.from(
        JSON.stringify({ id: outpass._id.toString(), student: outpass.studentId.toString() })
      ).toString('base64');
    } else if (status === 'rejected') {
      outpass.qrData = null;
    }

    await outpass.save();
    res.json(outpass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update status.' });
  }
});

module.exports = router;
