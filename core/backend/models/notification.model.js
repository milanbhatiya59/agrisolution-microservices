import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema({
  farm: {
    type: Schema.Types.ObjectId,
    ref: 'Farm',
    required: true,
    index: true,
  },
  tasks: [
    {
      date: {
        type: Date,
        required: true,
      },
      taskType: {
        type: String,
        enum: [
          'Watering',
          'Fertilizing',
          'Pesticide',
          'Harvesting',
          'Observation',
          'Weeding',
          'Fertilization',
          'Pest Control',
          'Thinning',
          'Other',
          'Pest & Disease Control',
          'Other Farming Activities',
          'Soil Amendment', // newly added
        ],
        default: 'Other', // fallback for unknown taskTypes
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: false,
      },
      unit: {
        type: String,
        enum: ['liters', 'kg', 'grams', 'hectares', 'units', 'kg/ha'],
        required: false,
      },
      status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending',
      },
    },
  ],
});

export const Notification = mongoose.model('Notification', notificationSchema);
