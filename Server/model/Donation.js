import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  amount: { 
    type: mongoose.Types.Decimal128, 
    required: true 
  },
  donor_address: { 
    type: String, 
    required: true 
  },
  donor_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false 
  },
  project_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  currency: { 
    type: String, 
    required: true,
    default: 'ETH'
  },
  transaction_hash: { 
    type: String, 
    required: true 
  },
  payment_address: { 
    type: String, 
    required: true 
  },
  network: { 
    type: String, 
    required: true,
    default: 'Ethereum'
  },
  selected_reward: { 
    type: String 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
});

donationSchema.set('toJSON', {
  transform: function (doc, ret) {
    if (ret.amount) {
      ret.amount = parseFloat(ret.amount.toString());
    }
    return ret;
  }
});

export default mongoose.model('Donation', donationSchema);