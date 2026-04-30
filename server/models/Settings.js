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
    tagline: { type: String, default: 'Shuddham Bhojanam • Satvikam Jeevanam' },
    whatsappNumber: { type: String, default: '919035735818' },
    contactEmail: { type: String, default: 'info@annakshetram.com' },
    contactPhone: { type: String, default: '+91 9035735818' },
    address: { type: String, default: 'Karnataka, India' },
    facebookUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    aboutText: { type: String, default: '' },
    
    // Shipping Configuration
    shippingConfig: {
      localState: { type: String, default: 'Karnataka' }, // Your local state
      localCharges: [
        {
          minOrder: { type: Number, default: 0 },
          maxOrder: { type: Number, default: 500 },
          charge: { type: Number, default: 60 },
        },
        {
          minOrder: { type: Number, default: 500 },
          maxOrder: { type: Number, default: 999999 },
          charge: { type: Number, default: 0 }, // Free shipping above 500
        },
      ],
      otherStatesCharges: [
        {
          minOrder: { type: Number, default: 0 },
          maxOrder: { type: Number, default: 500 },
          charge: { type: Number, default: 100 },
        },
        {
          minOrder: { type: Number, default: 500 },
          maxOrder: { type: Number, default: 1000 },
          charge: { type: Number, default: 80 },
        },
        {
          minOrder: { type: Number, default: 1000 },
          maxOrder: { type: Number, default: 999999 },
          charge: { type: Number, default: 0 }, // Free shipping above 1000
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
