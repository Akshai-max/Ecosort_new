import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const managerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
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
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
    },
    pincode: {
      type: String,
      required: [true, 'PIN code is required'],
      match: [/^\d{6}$/, 'Please enter a valid 6-digit PIN code'],
    },
  },
  dateOfBirth: {
    type: String,
    required: [true, 'Date of birth is required'],
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other'],
  },
  role: {
    type: String,
    enum: ['manager'],
    default: 'manager',
  },
  // Manager-specific fields
  department: {
    type: String,
    default: 'Waste Management',
  },
  employeeId: {
    type: String,
    unique: true,
    required: true,
  },
  hireDate: {
    type: Date,
    default: Date.now,
  },
  salary: {
    type: Number,
    min: 0,
  },
  permissions: [{
    type: String,
    enum: ['view_dashboard', 'manage_employees', 'manage_zones', 'manage_tasks', 'view_analytics', 'manage_issues', 'send_notifications', 'generate_reports'],
    default: ['view_dashboard', 'manage_employees', 'manage_zones', 'manage_tasks', 'view_analytics', 'manage_issues', 'send_notifications', 'generate_reports']
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true,
});

// Hash password before saving
managerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
managerSchema.methods.comparePassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.Manager || mongoose.model('Manager', managerSchema);





