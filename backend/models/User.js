import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, default: 'User' },
  handle: { type: String, default: 'user' },
  email: { type: String, default: '', lowercase: true, trim: true, unique: true, sparse: true },
  passwordHash: { type: String, default: '' },
  avatar: { type: String, default: '' },
  sessionToken: { type: String, default: '', index: true },
  sessionExpires: { type: Date, default: null }
}, { timestamps: true });

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.passwordHash;
    delete ret.sessionToken;
    delete ret.sessionExpires;
    return ret;
  }
});

export const User = mongoose.model('User', userSchema);
