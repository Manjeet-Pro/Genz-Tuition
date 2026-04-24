const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

connectDB();

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await Admin.findOne({ email: 'admin@genz.com' });

    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    const admin = new Admin({
      name: 'GenZ Master Admin',
      email: 'admin@genz.com',
      password: 'adminpassword123' // This will be hashed by the model pre-save hook
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Login Email: admin@genz.com');
    console.log('Login Password: adminpassword123');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
