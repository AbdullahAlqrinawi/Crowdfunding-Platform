import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: { 
    type: String, 
    required: true,
    trim: true 
  },
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  project_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  parent_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment', 
    default: null 
  }
}, {
  timestamps: true 
});

commentSchema.index({ project_id: 1, createdAt: -1 });
commentSchema.index({ user_id: 1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;