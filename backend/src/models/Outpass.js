const mongoose = require('mongoose');

const outpassSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentName: { type: String, required: true },
    studentProgram: { type: String },
    studentBatch: { type: String },
    studentRollNo: { type: String },
    hostel: { type: String, default: '' },
    wing: { type: String, default: '' },
    reason: { type: String, required: true },
    destination: { type: String, required: true },
    items: { type: String, default: '' },
    dateOut: { type: Date, required: true },
    dateIn: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'active', 'completed'],
      default: 'pending',
    },
    qrData: { type: String, default: null },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-generate qrData token when approved
outpassSchema.pre('save', function (next) {
  if (this.status === 'approved' && !this.qrData) {
    this.qrData = Buffer.from(
      JSON.stringify({ id: this._id.toString(), student: this.studentId.toString() })
    ).toString('base64');
  }
  if (this.status === 'rejected' || this.status === 'pending') {
    this.qrData = null;
  }
  next();
});

module.exports = mongoose.model('Outpass', outpassSchema);
