const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Define the Employee schema
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

// Define the Zone schema
const zoneSchema = new mongoose.Schema({
  zoneId: {
    type: String,
    required: [true, 'Zone ID is required'],
    unique: true,
    trim: true,
  },
  zoneName: {
    type: String,
    required: [true, 'Zone name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  area: {
    type: String,
    required: [true, 'Area is required'],
    trim: true,
  },
  population: {
    type: String,
    required: [true, 'Population is required'],
    trim: true,
  },
  collectionDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  }],
  collectionTime: {
    type: String,
    required: [true, 'Collection time is required'],
    trim: true,
  },
  manager: {
    type: String,
    required: [true, 'Manager is required'],
    trim: true,
  },
  coordinates: {
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
    },
  },
  routes: [{
    routeId: {
      type: String,
      required: true,
    },
    routeName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    waypoints: [{
      latitude: Number,
      longitude: Number,
      name: String,
      type: {
        type: String,
        enum: ['collection_point', 'landmark', 'checkpoint'],
      },
    }],
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Define the Task schema
const taskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: [true, 'Task ID is required'],
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Assigned to is required'],
  },
  assignedBy: {
    type: String,
    required: [true, 'Assigned by is required'],
    trim: true,
  },
  zoneId: {
    type: String,
    required: [true, 'Zone ID is required'],
    trim: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  estimatedDuration: {
    type: String,
    required: [true, 'Estimated duration is required'],
    trim: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  completedAt: {
    type: Date,
    required: false,
  },
  proofOfWork: [{
    type: String, // File URLs or base64 strings
  }],
  notes: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for better query performance
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ zoneId: 1, status: 1 });
taskSchema.index({ dueDate: 1 });

// Create models
const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
const Zone = mongoose.models.Zone || mongoose.model('Zone', zoneSchema);
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

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

const sampleZones = [
  {
    zoneId: 'ZONE001',
    zoneName: 'Downtown Zone',
    description: 'Central business district collection area',
    area: '2.5 sq miles',
    population: '15,000',
    collectionDays: ['Monday', 'Wednesday', 'Friday'],
    collectionTime: '06:00-14:00',
    manager: 'Manager Smith',
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    routes: [
      {
        routeId: 'ROUTE001',
        routeName: 'Main Street Route',
        description: 'Primary collection route through Main Street',
        waypoints: [
          { latitude: 40.7128, longitude: -74.0060, name: 'Start Point', type: 'checkpoint' },
          { latitude: 40.7130, longitude: -74.0058, name: 'Main Street Collection Point', type: 'collection_point' },
          { latitude: 40.7132, longitude: -74.0056, name: 'End Point', type: 'checkpoint' }
        ]
      }
    ]
  },
  {
    zoneId: 'ZONE002',
    zoneName: 'Industrial Zone',
    description: 'Industrial waste processing area',
    area: '5.2 sq miles',
    population: '8,000',
    collectionDays: ['Tuesday', 'Thursday', 'Saturday'],
    collectionTime: '05:00-13:00',
    manager: 'Manager Johnson',
    coordinates: {
      latitude: 40.7589,
      longitude: -73.9851
    },
    routes: [
      {
        routeId: 'ROUTE002',
        routeName: 'Industrial Route A',
        description: 'Industrial waste collection route',
        waypoints: [
          { latitude: 40.7589, longitude: -73.9851, name: 'Industrial Start', type: 'checkpoint' },
          { latitude: 40.7591, longitude: -73.9849, name: 'Factory Collection Point', type: 'collection_point' }
        ]
      }
    ]
  },
  {
    zoneId: 'ZONE003',
    zoneName: 'Residential Zone A',
    description: 'Primary residential collection area',
    area: '3.8 sq miles',
    population: '25,000',
    collectionDays: ['Monday', 'Thursday'],
    collectionTime: '07:00-15:00',
    manager: 'Manager Wilson',
    coordinates: {
      latitude: 40.7505,
      longitude: -73.9934
    },
    routes: [
      {
        routeId: 'ROUTE003',
        routeName: 'Residential Route A',
        description: 'Residential waste collection route',
        waypoints: [
          { latitude: 40.7505, longitude: -73.9934, name: 'Residential Start', type: 'checkpoint' },
          { latitude: 40.7507, longitude: -73.9932, name: 'Housing Complex', type: 'collection_point' }
        ]
      }
    ]
  },
  {
    zoneId: 'ZONE004',
    zoneName: 'Commercial Zone',
    description: 'Commercial and retail waste collection',
    area: '1.9 sq miles',
    population: '12,000',
    collectionDays: ['Tuesday', 'Friday'],
    collectionTime: '06:30-14:30',
    manager: 'Manager Davis',
    coordinates: {
      latitude: 40.7614,
      longitude: -73.9776
    },
    routes: [
      {
        routeId: 'ROUTE004',
        routeName: 'Commercial Route',
        description: 'Commercial waste collection route',
        waypoints: [
          { latitude: 40.7614, longitude: -73.9776, name: 'Commercial Start', type: 'checkpoint' },
          { latitude: 40.7616, longitude: -73.9774, name: 'Shopping Center', type: 'collection_point' }
        ]
      }
    ]
  },
  {
    zoneId: 'ZONE005',
    zoneName: 'Suburban Zone',
    description: 'Suburban residential area',
    area: '4.1 sq miles',
    population: '18,000',
    collectionDays: ['Wednesday', 'Saturday'],
    collectionTime: '07:30-15:30',
    manager: 'Manager Taylor',
    coordinates: {
      latitude: 40.7282,
      longitude: -73.7949
    },
    routes: [
      {
        routeId: 'ROUTE005',
        routeName: 'Suburban Route',
        description: 'Suburban waste collection route',
        waypoints: [
          { latitude: 40.7282, longitude: -73.7949, name: 'Suburban Start', type: 'checkpoint' },
          { latitude: 40.7284, longitude: -73.7947, name: 'Suburban Collection Point', type: 'collection_point' }
        ]
      }
    ]
  },
  {
    zoneId: 'ZONE006',
    zoneName: 'Data Collection Zone',
    description: 'Specialized data collection and analysis area',
    area: '1.2 sq miles',
    population: '5,000',
    collectionDays: ['Monday', 'Wednesday', 'Friday'],
    collectionTime: '08:00-16:00',
    manager: 'Manager Anderson',
    coordinates: {
      latitude: 40.6892,
      longitude: -74.0445
    },
    routes: [
      {
        routeId: 'ROUTE006',
        routeName: 'Data Collection Route',
        description: 'Data collection and analysis route',
        waypoints: [
          { latitude: 40.6892, longitude: -74.0445, name: 'Data Center Start', type: 'checkpoint' },
          { latitude: 40.6894, longitude: -74.0443, name: 'Data Collection Point', type: 'collection_point' }
        ]
      }
    ]
  }
];

// Hash passwords before creating employees
async function hashPasswords() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  return hashedPassword;
}

const sampleEmployees = [
  {
    name: 'John Doe',
    email: 'john.doe@ecosort.com',
    password: '', // Will be set after hashing
    employeeId: 'EMP001',
    department: 'Waste Management',
    position: 'Collection Specialist',
    zoneId: 'ZONE001',
    zoneName: 'Downtown Zone',
    hireDate: new Date('2023-01-15'),
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, City, State 12345',
    dateOfBirth: new Date('1990-05-15'),
    gender: 'male',
    points: 1250,
    rank: 'Senior Specialist',
    isActive: true,
    lastLogin: new Date(),
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        showProfile: true,
        showActivity: false
      },
      language: 'en',
      timezone: 'America/New_York'
    }
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@ecosort.com',
    password: '', // Will be set after hashing
    employeeId: 'EMP002',
    department: 'Waste Processing',
    position: 'Sorting Technician',
    zoneId: 'ZONE002',
    zoneName: 'Industrial Zone',
    hireDate: new Date('2022-08-20'),
    phone: '+1 (555) 234-5678',
    address: '456 Oak Avenue, City, State 12345',
    dateOfBirth: new Date('1988-12-03'),
    gender: 'female',
    points: 2100,
    rank: 'Lead Technician',
    isActive: true,
    lastLogin: new Date(),
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: true
      },
      privacy: {
        showProfile: true,
        showActivity: true
      },
      language: 'en',
      timezone: 'America/New_York'
    }
  },
  {
    name: 'Mike Wilson',
    email: 'mike.wilson@ecosort.com',
    password: '', // Will be set after hashing
    employeeId: 'EMP003',
    department: 'Operations',
    position: 'Route Supervisor',
    zoneId: 'ZONE003',
    zoneName: 'Residential Zone A',
    hireDate: new Date('2021-03-10'),
    phone: '+1 (555) 345-6789',
    address: '789 Pine Street, City, State 12345',
    dateOfBirth: new Date('1985-09-22'),
    gender: 'male',
    points: 3200,
    rank: 'Supervisor',
    isActive: true,
    lastLogin: new Date(),
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: true
      },
      privacy: {
        showProfile: true,
        showActivity: true
      },
      language: 'en',
      timezone: 'America/New_York'
    }
  },
  {
    name: 'Lisa Chen',
    email: 'lisa.chen@ecosort.com',
    password: '', // Will be set after hashing
    employeeId: 'EMP004',
    department: 'Maintenance',
    position: 'Equipment Technician',
    zoneId: 'ZONE004',
    zoneName: 'Commercial Zone',
    hireDate: new Date('2023-06-01'),
    phone: '+1 (555) 456-7890',
    address: '321 Elm Drive, City, State 12345',
    dateOfBirth: new Date('1992-11-18'),
    gender: 'female',
    points: 980,
    rank: 'Technician',
    isActive: true,
    lastLogin: new Date(),
    preferences: {
      notifications: {
        email: true,
        push: false,
        sms: false
      },
      privacy: {
        showProfile: false,
        showActivity: false
      },
      language: 'en',
      timezone: 'America/New_York'
    }
  },
  {
    name: 'Robert Martinez',
    email: 'robert.martinez@ecosort.com',
    password: '', // Will be set after hashing
    employeeId: 'EMP005',
    department: 'Transportation',
    position: 'Collection Driver',
    zoneId: 'ZONE005',
    zoneName: 'Suburban Zone',
    hireDate: new Date('2022-11-15'),
    phone: '+1 (555) 567-8901',
    address: '654 Maple Lane, City, State 12345',
    dateOfBirth: new Date('1987-04-08'),
    gender: 'male',
    points: 1750,
    rank: 'Senior Driver',
    isActive: true,
    lastLogin: new Date(),
    preferences: {
      notifications: {
        email: false,
        push: true,
        sms: true
      },
      privacy: {
        showProfile: true,
        showActivity: true
      },
      language: 'es',
      timezone: 'America/New_York'
    }
  },
  {
    name: 'Jennifer Brown',
    email: 'jennifer.brown@ecosort.com',
    password: '', // Will be set after hashing
    employeeId: 'EMP006',
    department: 'Analytics',
    position: 'Waste Analyst',
    zoneId: 'ZONE006',
    zoneName: 'Data Collection Zone',
    hireDate: new Date('2023-09-05'),
    phone: '+1 (555) 678-9012',
    address: '987 Cedar Court, City, State 12345',
    dateOfBirth: new Date('1991-07-14'),
    gender: 'female',
    points: 1450,
    rank: 'Analyst',
    isActive: true,
    lastLogin: new Date(),
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        showProfile: true,
        showActivity: false
      },
      language: 'en',
      timezone: 'America/New_York'
    }
  }
];

const sampleTasks = [
  {
    taskId: 'TASK001',
    title: 'Collect waste from Main Street',
    description: 'Complete waste collection for Main Street route including all residential and commercial bins',
    assignedTo: null, // Will be set after employee creation
    assignedBy: 'Manager Smith',
    zoneId: 'ZONE001',
    priority: 'high',
    status: 'pending',
    dueDate: new Date('2024-01-15T14:00:00Z'),
    estimatedDuration: '4 hours',
    points: 50,
    tags: ['collection', 'main-street', 'high-priority']
  },
  {
    taskId: 'TASK002',
    title: 'Sort recyclables at Station B',
    description: 'Sort and process recyclable materials at processing station B',
    assignedTo: null, // Will be set after employee creation
    assignedBy: 'Manager Johnson',
    zoneId: 'ZONE002',
    priority: 'medium',
    status: 'completed',
    dueDate: new Date('2024-01-15T12:00:00Z'),
    completedAt: new Date('2024-01-15T11:30:00Z'),
    estimatedDuration: '3 hours',
    points: 30,
    tags: ['sorting', 'recyclables', 'station-b']
  },
  {
    taskId: 'TASK003',
    title: 'Equipment maintenance check',
    description: 'Perform routine maintenance check on collection vehicle #3',
    assignedTo: null, // Will be set after employee creation
    assignedBy: 'Manager Davis',
    zoneId: 'ZONE004',
    priority: 'high',
    status: 'in_progress',
    dueDate: new Date('2024-01-15T16:00:00Z'),
    estimatedDuration: '2 hours',
    points: 40,
    tags: ['maintenance', 'equipment', 'vehicle']
  }
];

async function populateDatabase() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing data
    await Employee.deleteMany({});
    await Zone.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    // Insert zones
    const createdZones = await Zone.insertMany(sampleZones);
    console.log(`Created ${createdZones.length} zones`);

    // Hash passwords and insert employees
    const hashedPassword = await bcrypt.hash('password123', 10);
    const employeesWithHashedPasswords = sampleEmployees.map(emp => ({
      ...emp,
      password: hashedPassword
    }));
    
    const createdEmployees = await Employee.insertMany(employeesWithHashedPasswords);
    console.log(`Created ${createdEmployees.length} employees`);

    // Update tasks with employee references
    const updatedTasks = sampleTasks.map((task, index) => ({
      ...task,
      assignedTo: createdEmployees[index % createdEmployees.length]._id
    }));

    // Insert tasks
    const createdTasks = await Task.insertMany(updatedTasks);
    console.log(`Created ${createdTasks.length} tasks`);

    console.log('Database populated successfully!');
    console.log('\nSample login credentials:');
    console.log('Employee ID: EMP001, Password: password123');
    console.log('Employee ID: EMP002, Password: password123');
    console.log('Employee ID: EMP003, Password: password123');
    console.log('Employee ID: EMP004, Password: password123');
    console.log('Employee ID: EMP005, Password: password123');
    console.log('Employee ID: EMP006, Password: password123');

  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    process.exit(0);
  }
}

populateDatabase();
