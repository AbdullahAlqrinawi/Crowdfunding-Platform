import mongoose from 'mongoose';

const supportTierSchema = new mongoose.Schema({
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: mongoose.Types.Decimal128, required: true },
  limit: { type: Number, required: true },
  claimed_count: { type: Number, default: 0 }
});

const SupportTier = mongoose.model('SupportTier', supportTierSchema);

export default SupportTier;
