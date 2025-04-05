import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
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
    enum: ['user', 'manager', 'admin'],
    default: 'user',
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema); 