const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const { haversineDistance } = require('../utils/haversine');

const OFFICE_LAT = parseFloat(process.env.OFFICE_LATITUDE);
const OFFICE_LON = parseFloat(process.env.OFFICE_LONGITUDE);
const ALLOWED_RADIUS = parseInt(process.env.ATTENDANCE_ALLOWED_RADIUS_METERS || '100', 10);

function todayDateStr() { return new Date().toISOString().slice(0,10); }

exports.checkIn = async (req, res, next) => {
  try {
    const { lat, lon } = req.body;
    const empId = req.params.employeeId;
    const emp = await Employee.findById(empId);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });

    const dist = haversineDistance(OFFICE_LAT, OFFICE_LON, lat, lon);
    if (dist > ALLOWED_RADIUS) return res.status(400).json({ message: `Outside allowed radius: ${Math.round(dist)}m` });

    const date = todayDateStr();
    let att = await Attendance.findOne({ employee: empId, date });
    if (att && att.checkIn && !att.checkOut) {
      return res.status(400).json({ message: 'Already checked in' });
    }
    if (!att) {
      att = new Attendance({ employee: empId, date, checkIn: { time: new Date().toISOString(), lat, lon } });
    } else {
      att.checkIn = { time: new Date().toISOString(), lat, lon };
    }
    await att.save();
    res.json({ message: 'Checked in', attendance: att });
  } catch (err) { next(err); }
};

exports.checkOut = async (req, res, next) => {
  try {
    const { lat, lon } = req.body;
    const empId = req.params.employeeId;
    const att = await Attendance.findOne({ employee: empId, date: todayDateStr() });
    if (!att || !att.checkIn) return res.status(400).json({ message: 'Not checked in' });
    if (att.checkOut) return res.status(400).json({ message: 'Already checked out' });

    const dist = haversineDistance(OFFICE_LAT, OFFICE_LON, lat, lon);
    if (dist > ALLOWED_RADIUS) return res.status(400).json({ message: `Outside allowed radius: ${Math.round(dist)}m` });

    att.checkOut = { time: new Date().toISOString(), lat, lon };
    await att.save();
    res.json({ message: 'Checked out', attendance: att });
  } catch (err) { next(err); }
};

exports.attendanceReport = async (req, res, next) => {
  try {
    // sample filters: ?start=2025-10-01&end=2025-10-10&employeeId=...
    const { start, end, employeeId } = req.query;
    const filter = {};
    if (employeeId) filter.employee = employeeId;
    if (start && end) {
      filter.date = { $gte: start, $lte: end };
    }
    const rows = await Attendance.find(filter).populate('employee');
   
    res.json(rows);
  } catch (err) { next(err); }
};
