import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  avatar: { type: String, default: '' },
  role: { type: String, default: 'participant' },
  muted: { type: Boolean, default: false },
  cameraOn: { type: Boolean, default: true },
  isPublisher: { type: Boolean, default: false },
  absent: { type: Boolean, default: false },
  videoPoster: { type: String, default: '' }
}, { _id: true });

function makeMeetingCode() {
  const chunk = (n) => Math.random().toString(36).slice(2, 2 + n);
  return `${chunk(3)}-${chunk(4)}-${chunk(3)}`.toLowerCase();
}

const callSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled call' },
  code: { type: String, default: makeMeetingCode, unique: true, index: true },
  badge: { type: String, default: 'Team' },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  invitedCount: { type: Number, default: 0 },
  absentCount: { type: Number, default: 0 },
  durationSeconds: { type: Number, default: 0 },
  recording: { type: Boolean, default: true },
  transcript: { type: String, default: '' },
  transcriptNew: { type: Boolean, default: true },
  participants: { type: [participantSchema], default: [] },
  typingUser: { type: String, default: '' }
}, { timestamps: true });

callSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    return ret;
  }
});

export const Call = mongoose.model('Call', callSchema);
