const mongoose = require('mongoose');

const gateLogSchema = new mongoose.Schema(
  {
    outpassId: { type: mongoose.Schema.Types.ObjectId, ref: 'Outpass', required: true },
    studentName: { type: String, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    studentRollNo: { type: String, default: '' },
    reason: { type: String, default: '' },
    hostel: { type: String, default: '' },
    room: { type: String, default: '' },
    mobile: { type: String, default: '' },
    type: { type: String, enum: ['entry', 'exit'], required: true },
    loggedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GateLog', gateLogSchema);
