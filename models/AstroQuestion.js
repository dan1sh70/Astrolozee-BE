import mongoose from 'mongoose';

const astroQuestionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional if you want to allow anonymous questions
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  context: {
    type: String,
    default: ''
  },
  ragWithContext: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    default: ''
  },
  answer: {
    type: String,
    default: ''
  },
  remedy: {
    type: String,
    default: ''
  },
  retrievedSources: [{
    source: String,
    page: Number,
    verse: String
  }],
  responseTime: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  errorMessage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
astroQuestionSchema.index({ userId: 1, createdAt: -1 });
astroQuestionSchema.index({ category: 1 });

export default mongoose.model('AstroQuestion', astroQuestionSchema);