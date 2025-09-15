import mongoose from 'mongoose';

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

export default mongoose.models.Task || mongoose.model('Task', taskSchema);
