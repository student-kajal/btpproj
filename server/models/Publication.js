import mongoose from 'mongoose';

const PublicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  authors: [{
    type: String,
    required: true,
    trim: true
  }],
  journal: String,
  conference: String,
  doi: String,
  publishedDate: {
    type: Date,
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
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
  type: {
    type: String,
    enum: ['journal', 'conference', 'book_chapter', 'patent', 'other'],
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['published', 'accepted', 'under_review', 'submitted'],
    required: true,
    index: true
  },
  url: String,
  citations: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
PublicationSchema.index({ session: 1, semester: 1, type: 1 });
PublicationSchema.index({ professor: 1, status: 1 });

export default mongoose.model('Publication', PublicationSchema);
