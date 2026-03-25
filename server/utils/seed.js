require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Settings = require('../models/Settings');

const runSeed = async () => {
  await connectDB();
  console.log('🌱 Starting seed...');

  // Admin user
  const adminExists = await User.findOne({ email: 'admin@annakshetram.com' });
  if (!adminExists) {
    await User.create({
      name: 'Admin',
      email: 'admin@annakshetram.com',
      passwordHash: await bcrypt.hash('Admin@123', 12),
      role: 'admin',
    });
    console.log('✅ Admin user created: admin@annakshetram.com / Admin@123');
  }

  // Settings
  const settingsExists = await Settings.findOne();
  if (!settingsExists) {
    await Settings.create({
      storeName: 'Annakshetram',
      tagline: 'Satvikam Jeevanam, Shuddham Bhojanam',
      whatsappNumber: '919035735818',
      contactEmail: 'info@annakshetram.com',
      contactPhone: '+91 9035735818',
      address: 'Karnataka, India',
    });
    console.log('✅ Site settings created');
  }

  // Categories
  const cats = [
    { name: 'Rice & Grains', description: 'Hand-processed heritage rice varieties and traditional grains' },
    { name: 'Flours & Millets', description: 'Stone-ground flours, ragi, jowar, bajra, and more' },
    { name: 'Oils & Ghee', description: 'Cold-pressed oils and traditional wooden churned ghee' },
    { name: 'Spices & Masalas', description: 'Sun-dried whole spices and hand-pound masala blends' },
    { name: 'Snacks & Sweets', description: 'Traditional savories and sweets made without preservatives' },
  ];

  const catDocs = [];
  for (const c of cats) {
    const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const exists = await Category.findOne({ slug });
    if (!exists) {
      const doc = await Category.create({ ...c, slug });
      catDocs.push(doc);
      console.log(`✅ Category: ${c.name}`);
    } else {
      catDocs.push(exists);
    }
  }

  // Products
  const products = [
    { name: 'Ragi Hurihittu', description: 'Traditional sprouted and roasted ragi flour, perfect for instant energy.', price: 240, mrp: 280, unit: '500 g', stock: 100, isFeatured: true, tags: ['ragi', 'traditional'] },
    { name: 'Godhi Hurihittu', description: 'Traditional roasted wheat flour, nutrient-dense and easy to digest.', price: 240, mrp: 280, unit: '500 g', stock: 100, isFeatured: true, tags: ['wheat', 'traditional'] },
    { name: 'Ragi Malt', description: 'Nutritious ragi malt powder, an excellent healthy drink for all ages.', price: 600, mrp: 650, unit: '500 g', stock: 100, isFeatured: true, tags: ['ragi', 'health drink'] },
    { name: 'Multi Grain Mix', description: 'Healthy combination of assorted grains for complete daily nutrition.', price: 570, mrp: 620, unit: '500 g', stock: 80, isFeatured: false, tags: ['multigrain', 'healthy'] },
    { name: 'Kids Protein Mix', description: 'Natural protein-rich mix specifically formulated for growing children.', price: 750, mrp: 850, unit: '500 g', stock: 60, isFeatured: true, tags: ['protein', 'kids'] },
    { name: 'Diabetic Friendly Mix', description: 'Specially crafted mix with low glycemic index, suitable for diabetics.', price: 600, mrp: 680, unit: '500 g', stock: 50, isFeatured: true, tags: ['diabetic-friendly', 'healthy'] },
  ];

  if (catDocs.length > 0) {
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const exists = await Product.findOne({ slug });
      if (!exists) {
        const catIdx = Math.min(i, catDocs.length - 1);
        await Product.create({
          ...p,
          slug,
          categoryId: catDocs[catIdx].categoryId,
          longDescription: `${p.description}. Sourced from organic farms in Karnataka and processed using traditional methods without any chemicals or preservatives.`,
        });
        console.log(`✅ Product: ${p.name}`);
      }
    }
  }

  console.log('\n🎉 Seed complete!');
  console.log('🔐 Admin Login: admin@annakshetram.com / Admin@123');
};

// Run directly: node utils/seed.js
if (require.main === module) {
  runSeed().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
}

module.exports = runSeed;
