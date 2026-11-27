const Channel = require('../models/Channel');
const Message = require('../models/Message');

const fallbackChannels = [
  { _id: 'fallback-1', id: 'general', name: 'general', description: 'Company-wide updates, open discussions, and general collaboration.', isPrivate: false, members: [] },
  { _id: 'fallback-2', id: 'engineering', name: 'engineering', description: 'System design, microservices latency, and distributed state coordination.', isPrivate: false, members: [] },
  { _id: 'fallback-3', id: 'announcements', name: 'announcements', description: 'Deployment schedules, version bumps, and smoke testing verification.', isPrivate: false, members: [] },
  { _id: 'fallback-4', id: 'support-and-rca', name: 'support-and-rca', description: 'Production incidents, root-cause analysis, and customer triage.', isPrivate: false, members: [] }
];

const getChannels = async (req, res) => {
  try {
    const { userId } = req.query;
    // Public channels + private channels where user is a member
    const filter = {
      $or: [
        { isPrivate: false },
        { isPrivate: { $exists: false } },
        ...(userId ? [{ members: userId }] : [])
      ]
    };

    const channels = await Channel.find(filter).sort({ createdAt: 1 });
    res.json(channels.length > 0 ? channels : fallbackChannels);
  } catch (err) {
    console.warn('[Pulse Backend] Using fallback channels:', err.message);
    res.json(fallbackChannels);
  }
};

const createChannel = async (req, res) => {
  try {
    const { name, description, isPrivate, createdBy } = req.body;
    if (!name) return res.status(400).json({ error: 'Channel name is required' });

    const cleanName = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/#/g, '');
    const newChannel = new Channel({
      name: cleanName,
      description: description || 'Discussion and collaboration channel',
      isPrivate: Boolean(isPrivate),
      createdBy: createdBy || 'user',
      members: createdBy ? [createdBy] : []
    });

    await newChannel.save();
    res.status(201).json(newChannel);
  } catch (err) {
    console.error('Error creating channel:', err);
    res.status(500).json({ error: 'Failed to create channel' });
  }
};

const joinChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const channel = await Channel.findById(id);
    if (!channel) return res.status(404).json({ error: 'Channel not found' });

    if (userId && !channel.members.includes(userId)) {
      channel.members.push(userId);
      await channel.save();
    }

    res.json(channel);
  } catch (err) {
    res.status(500).json({ error: 'Failed to join channel' });
  }
};

const deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;
    await Channel.findByIdAndDelete(id);
    await Message.deleteMany({ roomId: id });
    res.json({ message: 'Channel deleted successfully', id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete channel' });
  }
};

module.exports = {
  getChannels,
  createChannel,
  joinChannel,
  deleteChannel
};
