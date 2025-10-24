const router = require('express').Router();
const attCtrl = require('../controllers/attendance.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.post('/:employeeId/checkin', auth, role(['employee','admin','hr','manager']), attCtrl.checkIn);
router.post('/:employeeId/checkout', auth, role(['employee','admin','hr','manager']), attCtrl.checkOut);
router.get('/report', auth, role(['admin','hr','manager']), attCtrl.attendanceReport);

module.exports = router;
