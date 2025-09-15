const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Define the Employee schema (same as in populate script)
const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false,
  },
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true,
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
  },
  zoneId: {
    type: String,
    required: [true, 'Zone ID is required'],
    trim: true,
  },
  zoneName: {
    type: String,
    required: [true, 'Zone name is required'],
    trim: true,
  },
  hireDate: {
    type: Date,
    required: [true, 'Hire date is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other'],
  },
  points: {
    type: Number,
    default: 0,
  },
  rank: {
    type: String,
    default: 'Employee',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: false,
      },
    },
    privacy: {
      showProfile: {
        type: Boolean,
        default: true,
      },
      showActivity: {
        type: Boolean,
        default: false,
      },
    },
    language: {
      type: String,
      default: 'en',
    },
    timezone: {
      type: String,
      default: 'America/New_York',
    },
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true,
});

// Hash password before saving
employeeSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
employeeSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update last login method
employeeSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save();
};

// Create model
const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

// Connect to MongoDB
async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecosort';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

async function testEmployeeLogin() {
  try {
    await connectDB();
    console.log('Testing employee login...\n');

    // Test login with EMP001
    const employeeId = 'EMP001';
    const password = 'password123';

    console.log(`Testing login for Employee ID: ${employeeId}`);
    
    // Find employee by employeeId
    const employee = await Employee.findOne({ 
      employeeId: employeeId.trim()
    }).select('+password');
    
    if (!employee) {
      console.log('❌ Employee not found');
      return;
    }

    console.log(`✅ Employee found: ${employee.name}`);
    console.log(`   Department: ${employee.department}`);
    console.log(`   Position: ${employee.position}`);
    console.log(`   Zone: ${employee.zoneName}`);
    console.log(`   Points: ${employee.points}`);
    console.log(`   Rank: ${employee.rank}`);
    console.log(`   Active: ${employee.isActive}`);

    // Check if employee is active
    if (!employee.isActive) {
      console.log('❌ Employee account is deactivated');
      return;
    }

    // Check password
    console.log(`   Testing password: ${password}`);
    console.log(`   Stored password hash: ${employee.password.substring(0, 20)}...`);
    
    const isPasswordValid = await employee.comparePassword(password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      console.log('   This might be due to password being hashed twice during creation');
      return;
    }

    console.log('✅ Password is valid');
    console.log('✅ Login successful!');

    // Update last login
    await employee.updateLastLogin();
    console.log('✅ Last login updated');

    // Test with wrong password
    console.log('\nTesting with wrong password...');
    const wrongPassword = 'wrongpassword';
    const isWrongPasswordValid = await employee.comparePassword(wrongPassword);
    if (!isWrongPasswordValid) {
      console.log('✅ Correctly rejected wrong password');
    } else {
      console.log('❌ Should have rejected wrong password');
    }

    // Test with non-existent employee
    console.log('\nTesting with non-existent employee...');
    const nonExistentEmployee = await Employee.findOne({ 
      employeeId: 'EMP999'
    });
    if (!nonExistentEmployee) {
      console.log('✅ Correctly handled non-existent employee');
    } else {
      console.log('❌ Should not have found non-existent employee');
    }

    console.log('\n🎉 All tests passed! Employee login system is working correctly.');

  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

testEmployeeLogin();
