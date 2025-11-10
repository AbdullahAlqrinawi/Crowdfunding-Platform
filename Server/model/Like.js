import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
}, { 
  timestamps: true 
});

likeSchema.index({ user_id: 1, project_id: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);

export default Like;