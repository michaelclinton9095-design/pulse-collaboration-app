const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  uploaderId: { type: String },
  roomId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Attachment', attachmentSchema);
