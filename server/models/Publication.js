// import mongoose from 'mongoose';

// const PublicationSchema = new mongoose.Schema({
//   doi: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   title: {
//     type: String,
//     required: true
//   },
//   authors: [{
//     type: String,
//     required: true
//   }],
//   journal: {
//     type: String,
//     required: true
//   },
//   year: {
//     type: Number,
//     required: true,
//     min: 1900,
//     max: new Date().getFullYear() + 1
//   },
//   volume: String,
//   issue: String,
//   pages: String,
//   publishedDate: Date,
//   group: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Group'
//   },
//   professor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
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
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// }, {
//   timestamps: true
// });

// export default mongoose.model('Publication', PublicationSchema);
import mongoose from 'mongoose';

const PublicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  doi: {
    type: String,
    trim: true
  },
  authors: [{
    type: String,
    trim: true
  }],
  publishedIn: {
    type: String,
    trim: true
  },
  publicationDate: {
    type: Date
  },
  url: {
    type: String,
    trim: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
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
  }
}, {
  timestamps: true
});

PublicationSchema.index({ group: 1, session: 1, semester: 1 });
PublicationSchema.index({ professor: 1 });

export default mongoose.model('Publication', PublicationSchema);
