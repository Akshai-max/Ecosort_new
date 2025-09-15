import mongoose from 'mongoose';

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

export default mongoose.models.Zone || mongoose.model('Zone', zoneSchema);
