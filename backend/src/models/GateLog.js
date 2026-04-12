const mongoose = require('mongoose');

const gateLogSchema = new mongoose.Schema(
  {
    outpassId: { type: mongoose.Schema.Types.ObjectId, ref: 'Outpass', required: true },
    studentName: { type: String, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['entry', 'exit'], required: true },
    loggedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GateLog', gateLogSchema);
