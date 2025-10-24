const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  checkIn: {
    time: String,
    lat: Number,
    lon: Number,
    method: { type: String, default: 'gps' }
  },
  checkOut: {
    time: String,
    lat: Number,
    lon: Number,
    method: { type: String }
  },
  status: { type: String, enum: ['present','absent','half-day','on-leave'], default: 'present' }
}, { timestamps: true });

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
