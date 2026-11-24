const express = require('express');
const router = express.Router();
const { getRoomMessages, createMessage, editMessage, deleteMessage } = require('../controllers/messageController');

router.get('/room/:roomId', getRoomMessages);
router.post('/', createMessage);
router.put('/:id', editMessage);
router.delete('/:id', deleteMessage);

module.exports = router;
