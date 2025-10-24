const router = require('express').Router();
const employeeCtrl = require('../controllers/employee.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');


router.post('/', auth, role(['admin','hr']), employeeCtrl.createEmployee);
router.get('/', auth, role(['admin','hr','manager']), employeeCtrl.getEmployees);
router.get('/:id', auth, role(['admin','hr','manager','employee']), employeeCtrl.getEmployee);
router.put('/:id', auth, role(['admin','hr']), employeeCtrl.updateEmployee);
router.delete('/:id', auth, role(['admin','hr']), employeeCtrl.deleteEmployee);

const OfficeConfig = require('../models/OfficeConfig'); // OfficeConfig Model-ஐ இங்கு இறக்குமதி செய்யவில்லை

router.post('/office-location', auth, role(['admin']), employeeCtrl.setOfficeLocation);
router.get('/office-location', auth, role(['admin','hr','manager','employee']), employeeCtrl.getOfficeLocation);


module.exports = router;
