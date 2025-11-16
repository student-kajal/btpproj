// import mongoose from 'mongoose';

// const GroupSchema = new mongoose.Schema({
//   groupName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   members: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   }],
//   professor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   projectTitle: {
//     type: String,
//     default: ''
//   },
//   projectDescription: {
//     type: String,
//     default: ''
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected'],
//     default: 'pending'
//   },
//   session: {
//     type: String,
//     required: true
//   },
//   semester: {
//     type: String,
//     enum: ['odd', 'even'],
//     required: true
//   },
//   rejectionReason: String,
//   proposedAt: {
//     type: Date,
//     default: Date.now
//   },
//   approvedAt: Date,
//   rejectedAt: Date
// }, {
//   timestamps: true
// });

// // Prevent duplicate group names in same session/semester
// GroupSchema.index({ groupName: 1, session: 1, semester: 1 }, { unique: true });

// export default mongoose.model('Group', GroupSchema);
import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    unique: true,
    trim: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  session: {
    type: String,
    required: true,
    default: '2024-25'
  },
  semester: {
    type: String,
    enum: ['odd', 'even'],
    required: true,
    default: 'odd'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  project: {
    title: String,
    description: String,
    assignedDate: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: String
}, {
  timestamps: true
});

// Index for faster queries
groupSchema.index({ members: 1 });
groupSchema.index({ name: 1 });
groupSchema.index({ status: 1 });

export default mongoose.model('Group', groupSchema);
