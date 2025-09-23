import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
  subjectId: { type: String, required: true, index: true },
  subjectRole: { type: String, enum: ['employee', 'manager', 'zone'], required: true },
  period: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  metrics: {
    tasksAssigned: { type: Number, default: 0 },
    tasksCompleted: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    efficiency: { type: Number, default: 0 },
    issuesReported: { type: Number, default: 0 },
  },
}, { timestamps: true });

performanceSchema.index({ subjectId: 1, 'period.start': 1, 'period.end': 1 });

export default mongoose.models.Performance || mongoose.model('Performance', performanceSchema);

