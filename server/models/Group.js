import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  session: {
    type: String,
    required: true,
    index: true
  },
  semester: {
    type: String,
    enum: ['odd', 'even'],
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['proposed', 'approved', 'rejected', 'active'],
    default: 'proposed',
    index: true
  },
  proposedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedAt: Date,
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  rejectionReason: String
}, {
  timestamps: true
});

// Indexes
GroupSchema.index({ session: 1, semester: 1, status: 1 });
GroupSchema.index({ professor: 1, status: 1 });
GroupSchema.index({ groupName: 1, session: 1, semester: 1 }, { unique: true });

export default mongoose.model('Group', GroupSchema);
