const Message = require('../models/Message');

const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 100 } = req.query;

    const messages = await Message.find({ roomId })
      .sort({ createdAt: 1 })
      .limit(Number(limit));

    res.json(messages);
  } catch (err) {
    console.warn('[Pulse Backend] Message fetch fallback:', err.message);
    res.json([]);
  }
};

const createMessage = async (req, res) => {
  try {
    const { roomId, sender, text, audioUrl, audioDuration, fileUrl, fileName, fileSize } = req.body;

    if (!roomId || !sender) {
      return res.status(400).json({ error: 'roomId and sender are required' });
    }

    if (!text && !audioUrl && !fileUrl) {
      return res.status(400).json({ error: 'Message content cannot be empty' });
    }

    const newMessage = new Message({
      roomId,
      sender,
      text: text ? text.trim() : '',
      audioUrl,
      audioDuration,
      fileUrl,
      fileName,
      fileSize
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
};

const editMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    message.text = text;
    message.editedAt = new Date();
    await message.save();

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to edit message' });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Message.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Message deleted', id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

module.exports = {
  getRoomMessages,
  createMessage,
  editMessage,
  deleteMessage
};
