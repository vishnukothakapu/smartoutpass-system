const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyGoogleToken, parseStudentEmail, ALLOWED_DOMAIN } = require('../utils/googleAuth');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

/**
 * POST /api/auth/login
 * Body: { email, password, role }
 * Used by Warden and Security (password-based login)
 */
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password and role are required.' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase(), role });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. Check your email and role.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Incorrect password.' });
    }

    const token = generateToken(user._id);
    return res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login.' });
  }
});

/**
 * POST /api/auth/google
 * Body: { credential } — Google ID token from frontend
 * Only accepts @iiitm.ac.in emails. Auto-creates student accounts.
 */
router.post('/google', async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'Google credential token is required.' });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
    return res.status(500).json({ message: 'Google OAuth is not configured on the server.' });
  }

  try {
    // 1. Verify the token with Google
    const payload = await verifyGoogleToken(credential, clientId);

    const email = payload.email?.toLowerCase();
    const name = payload.name;

    // 2. Enforce @iiitm.ac.in domain
    if (!email || !email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      return res.status(403).json({
        message: `Only @${ALLOWED_DOMAIN} email addresses are allowed.`,
      });
    }

    // 3. Parse student info from email prefix
    const { program, batch, year, rollNo } = parseStudentEmail(email);

    // 4. Find or create the student user
    let user = await User.findOne({ email, role: 'student' });

    if (!user) {
      // Auto-register the student on first Google login
      user = new User({
        name,
        email,
        // Set a random secure password (Google users never use it)
        password: Math.random().toString(36) + Math.random().toString(36),
        role: 'student',
        program,
        batch,
        year,
        rollNo,
        hostel: '',
        room: '',
        mobile: '',
        fatherName: '',
        fatherMobile: '',
      });
      await user.save();
    } else {
      // Update name/program/year in case they changed
      user.name = name;
      user.program = program;
      user.batch = batch;
      user.year = year;
      user.rollNo = rollNo;
      await user.save();
    }

    const token = generateToken(user._id);
    return res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    console.error('Google auth error:', err);
    if (err.message?.includes('Token used too late') || err.message?.includes('Invalid token')) {
      return res.status(401).json({ message: 'Google token is invalid or expired. Please try again.' });
    }
    return res.status(500).json({ message: 'Google authentication failed.' });
  }
});
/**
 * PATCH /api/auth/profile
 * Update editable profile fields. Locked fields (name, program, batch, year) are ignored.
 * Body: { hostel, room, mobile, fatherName, fatherMobile }  (any subset)
 */
router.patch('/profile', protect, async (req, res) => {
  // Whitelist: only these fields can be changed
  const EDITABLE = ['hostel', 'wing', 'room', 'mobile', 'fatherName', 'fatherMobile'];

  try {
    const updates = {};
    for (const key of EDITABLE) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Sync the updated user into localStorage-compatible shape
    return res.json({ user: user.toObject() });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ message: 'Failed to update profile.' });
  }
});

module.exports = router;

