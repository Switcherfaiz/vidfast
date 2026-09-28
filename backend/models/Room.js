import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true },
  title: { type: String, default: 'VidFast meeting', trim: true, maxlength: 120 },
  passwordHash: { type: String, default: '' }
}, { timestamps: true });

roomSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  }
});

export const Room = mongoose.model('Room', roomSchema);
