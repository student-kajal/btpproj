import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  sessionYear: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  semester: {
    type: String,
    enum: ['odd', 'even'],
    required: true
  },
  minGroupSize: {
    type: Number,
    required: true,
    min: 1,
    default: 2
  },
  maxGroupSize: {
    type: Number,
    required: true,
    min: 1,
    default: 4
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Session', SessionSchema);
