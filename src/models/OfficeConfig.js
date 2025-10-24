
const mongoose = require('mongoose');

const officeConfigSchema = new mongoose.Schema({
  officeName: { type: String, default: 'Main Office' },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  radius: { type: Number, required: true }, 
});

module.exports = mongoose.model('OfficeConfig', officeConfigSchema);