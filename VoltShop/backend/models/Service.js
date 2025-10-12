import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String, required: true },
  serviceType: { type: String, required: true },
  issueType: { type: String },
  description: { type: String, required: true },
  preferredDate: { type: String },
  preferredTime: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedTechnician: { type: String },
  notes: { type: String },
  estimatedCost: { type: Number },
  actualCost: { type: Number },
  completedAt: { type: Date }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
