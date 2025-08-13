const mongoose = require('mongoose');
const crypto = require('crypto');

const passwordEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    maxlength: [100, 'Username cannot exceed 100 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    maxlength: [500, 'Password cannot exceed 500 characters']
  },
  website: {
    type: String,
    trim: true,
    maxlength: [200, 'Website cannot exceed 200 characters']
  },
  category: {
    type: String,
    default: 'General',
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Encrypt password before saving
passwordEntrySchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.JWT_SECRET || 'fallback-key', 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(this.password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    this.password = iv.toString('hex') + ':' + encrypted;
    next();
  } catch (error) {
    next(error);
  }
});

// Decrypt password when retrieving
passwordEntrySchema.methods.decryptPassword = function() {
  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.JWT_SECRET || 'fallback-key', 'salt', 32);
    
    const parts = this.password.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Error decrypting password:', error);
    return 'Error decrypting password';
  }
};

// Index for better query performance
passwordEntrySchema.index({ userId: 1, title: 1 });
passwordEntrySchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('PasswordEntry', passwordEntrySchema);
