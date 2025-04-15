import mongoose, { Schema } from 'mongoose';

const chatSchema = new Schema(
  {
    community: {
      type: Schema.Types.ObjectId,
      ref: 'Community',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    attachments: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model('Message', chatSchema);
