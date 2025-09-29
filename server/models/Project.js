import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
    index: true
  },
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
    enum: ['assigned', 'in_progress', 'completed', 'under_review'],
    default: 'assigned',
    index: true
  },
  technologies: [{
    type: String,
    trim: true
  }],
  objectives: [{
    type: String,
    trim: true
  }],
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
ProjectSchema.index({ session: 1, semester: 1, status: 1 });
ProjectSchema.index({ professor: 1, status: 1 });

export default mongoose.model('Project', ProjectSchema);
