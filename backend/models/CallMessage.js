import mongoose from 'mongoose';

const callMessageSchema = new mongoose.Schema({
  callId: { type: mongoose.Schema.Types.ObjectId, ref: 'Call', index: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  authorName: { type: String, default: '' },
  avatar: { type: String, default: '' },
  text: { type: String, default: '' },
  type: { type: String, enum: ['message', 'system'], default: 'message' },
  outgoing: { type: Boolean, default: false },
  at: { type: Number, default: () => Date.now() }
}, { timestamps: true });

callMessageSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    return ret;
  }
});

export const CallMessage = mongoose.model('CallMessage', callMessageSchema);
