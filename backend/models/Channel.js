const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: 'Discussion and collaboration room' },
  isPrivate: { type: Boolean, default: false },
  members: [{ type: String }], // User IDs or emails
  createdBy: { type: String, default: 'system' }
}, { timestamps: true });

module.exports = mongoose.model('Channel', channelSchema);
