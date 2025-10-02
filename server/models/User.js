import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  password: {
    type: String,
    select: false
  },
  mobile: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'professor', 'admin'],
    required: true,
    index: true
  },
  department: {
    type: String,
    required: function() { 
      return this.role !== 'admin'; 
    }
  },
  specialization: {
    type: String,
    required: function() { 
      return this.role === 'student'; 
    }
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
  admissionType: {
    type: String,
    required: function() { 
      return this.role === 'student'; 
    }
  },
  category: {
    type: String,
    required: function() { 
      return this.role === 'student'; 
    }
  },
  designation: {  // <-- ADD THIS FIELD FOR FACULTY
    type: String,
    required: function() { 
      return this.role === 'professor'; 
    },
    default: 'Professor'
  },
  staffId: {
    type: String,
    required: function() { 
      return this.role === 'professor'; 
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Indexes
UserSchema.index({ session: 1, semester: 1, role: 1 });
UserSchema.index({ department: 1, role: 1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', UserSchema);
