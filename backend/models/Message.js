const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  roomId: { type: String, required: true, index: true },
  sender: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, default: '' },
    role: { type: String, default: 'Member' }
  },
  text: { type: String, default: '' },
  audioUrl: { type: String },
  audioDuration: { type: Number },
  fileUrl: { type: String },
  fileName: { type: String },
  fileSize: { type: Number },
  editedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
