import mongoose from 'mongoose';
import { ethers } from 'ethers'; 

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: mongoose.Schema.Types.Mixed, required: true }, 
  image: { type: String },
  target: { type: mongoose.Types.Decimal128, required: true },
  amount_raised: { type: mongoose.Types.Decimal128, default: 0 },
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'OPEN' },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  wallet_address: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return ethers.isAddress(v);
      },
      message: props => `${props.value} is not a valid Ethereum address!`
    }
  },
  rewards: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      amount: { type: mongoose.Types.Decimal128, required: true },
    }
  ],
  story: { type: String, required: true },
  location: { type: String, required: true },
  main_category: { type: String, required: true },
  optional_category: { type: String },
  project_type: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

projectSchema.set('toJSON', {
  transform: function (doc, ret) {
    if (ret.target) {
      ret.target = parseFloat(ret.target.toString());
    }
    if (ret.amount_raised) {
      ret.amount_raised = parseFloat(ret.amount_raised.toString());
    }
    if (ret.rewards && Array.isArray(ret.rewards)) {
      ret.rewards = ret.rewards.map(reward => ({
        ...reward,
        amount: parseFloat(reward.amount.toString())
      }));
    }
    return ret;
  }
});

const Project = mongoose.model('Project', projectSchema);

export default Project;