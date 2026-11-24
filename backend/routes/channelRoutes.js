const express = require('express');
const router = express.Router();
const { getChannels, createChannel, joinChannel, deleteChannel } = require('../controllers/channelController');

router.get('/', getChannels);
router.post('/', createChannel);
router.post('/:id/join', joinChannel);
router.delete('/:id', deleteChannel);

module.exports = router;
