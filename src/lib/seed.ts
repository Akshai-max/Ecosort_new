import connectDB from './mongodb';
import User from '@/models/User';
import Manager from '@/models/Manager';

export async function seedDatabase() {
  try {
    await connectDB();
    console.log('🌱 Starting database seeding...');

    // Check if manager already exists
    const existingManager = await User.findOne({ role: 'manager' });
    if (existingManager) {
      console.log('✅ Manager already exists in database');
      return;
    }

    // Create default manager user
    const managerData = {
      firstName: 'John',
      lastName: 'Manager',
      email: 'manager@ecosort.com',
      password: 'Manager123!',
      phone: '1234567890',
      address: {
        street: '123 Manager Street',
        city: 'EcoCity',
        state: 'GreenState',
        pincode: '123456'
      },
      dateOfBirth: '1985-06-15',
      gender: 'male',
      role: 'manager'
    };

    const manager = new User(managerData);
    await manager.save();

    console.log('✅ Default manager created successfully');
    console.log('📧 Email: manager@ecosort.com');
    console.log('🔑 Password: Manager123!');

    // Also create a Manager document for manager-specific data
    const managerSpecificData = {
      firstName: 'John',
      lastName: 'Manager',
      email: 'manager@ecosort.com',
      password: 'Manager123!',
      phone: '1234567890',
      address: {
        street: '123 Manager Street',
        city: 'EcoCity',
        state: 'GreenState',
        pincode: '123456'
      },
      dateOfBirth: '1985-06-15',
      gender: 'male',
      role: 'manager',
      department: 'Waste Management',
      employeeId: 'MGR001',
      hireDate: new Date(),
      salary: 75000,
      permissions: [
        'view_dashboard',
        'manage_employees',
        'manage_zones',
        'manage_tasks',
        'view_analytics',
        'manage_issues',
        'send_notifications',
        'generate_reports'
      ]
    };

    const managerDoc = new Manager(managerSpecificData);
    await managerDoc.save();

    console.log('✅ Manager-specific data created successfully');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Function to check if manager exists
export async function checkManagerExists() {
  try {
    await connectDB();
    const manager = await User.findOne({ role: 'manager' });
    return !!manager;
  } catch (error) {
    console.error('Error checking manager existence:', error);
    return false;
  }
}





