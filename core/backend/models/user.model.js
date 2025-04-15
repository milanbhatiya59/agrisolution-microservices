import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  farms: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Farm',
    },
  ],
});

export const User = mongoose.model('User', userSchema);
