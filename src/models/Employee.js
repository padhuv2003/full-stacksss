const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  designation: { type: String },
  department: { type: String },
  managerId: { type: mongoose.Types.ObjectId, ref: 'Employee' },
  dateOfJoining: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
