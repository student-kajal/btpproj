import mongoose from 'mongoose';

const PublicationSchema = new mongoose.Schema({
  doi: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  authors: [{
    type: String,
    required: true
  }],
  journal: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  volume: String,
  issue: String,
  pages: String,
  publishedDate: Date,
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  session: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    enum: ['odd', 'even'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Publication', PublicationSchema);
