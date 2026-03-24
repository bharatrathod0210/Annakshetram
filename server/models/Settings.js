const mongoose = require('mongoose');
const generateId = require('../utils/generateId');

const settingsSchema = new mongoose.Schema(
  {
    settingId: {
      type: String,
      default: () => generateId('setting'),
      unique: true,
    },
    storeName: { type: String, default: 'Annakshetram' },
    tagline: { type: String, default: 'Satvikam Jeevanam, Shuddham Bhojanam' },
    whatsappNumber: { type: String, default: '919035735818' },
    contactEmail: { type: String, default: 'contact@annakshetram.com' },
    contactPhone: { type: String, default: '+91 9035735818' },
    address: { type: String, default: 'Karnataka, India' },
    facebookUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    aboutText: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
