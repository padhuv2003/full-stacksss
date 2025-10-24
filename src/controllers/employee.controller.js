const Employee = require('../models/Employee');

exports.createEmployee = async (req, res, next) => {
  try {
    const data = req.body;
    const emp = await Employee.create(data);
    res.status(201).json(emp);
  } catch (err) { next(err); }
};

exports.getEmployees = async (req, res, next) => {
  try {
    const list = await Employee.find().limit(100);
    res.json(list);
  } catch (err) { next(err); }
};

exports.getEmployee = async (req, res, next) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Not found' });
    res.json(emp);
  } catch (err) { next(err); }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(emp);
  } catch (err) { next(err); }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

const OfficeConfig = require('../models/OfficeConfig'); 

exports.setOfficeLocation = async (req, res, next) => {
    
    try {
        const { latitude, longitude, radius, officeName } = req.body;
        
        let config = await OfficeConfig.findOne({});
        
        if (config) {
           
            Object.assign(config, { latitude, longitude, radius, officeName });
        } else {
           
            config = new OfficeConfig({ latitude, longitude, radius, officeName });
        }

        await config.save();
        res.json({ message: 'Office location set successfully.', config });
    } catch (err) { next(err); }
};

exports.getOfficeLocation = async (req, res, next) => {
    try {
        const config = await OfficeConfig.findOne({});
        if (!config) return res.status(404).json({ message: 'Office location not yet set.' });
        res.json(config);
    } catch (err) { next(err); }
};
