import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  notificationId: {
    type: String,
    required: [true, 'Notification ID is required'],
    unique: true,
    trim: true,
  },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['unread', 'read'], default: 'unread' },
  type: { type: String, enum: ['info', 'warning', 'success', 'urgent'], default: 'info' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
  recipientId: { type: String, required: true, index: true },
  recipientRole: { type: String, enum: ['manager', 'employee', 'user', 'admin'], required: true },
  senderId: { type: String, required: false },
  senderName: { type: String, required: false },
  actionRequired: { type: Boolean, default: false },
  actionUrl: { type: String, required: false },
  metadata: { type: mongoose.Schema.Types.Mixed },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ recipientId: 1, isRead: 1 });

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

