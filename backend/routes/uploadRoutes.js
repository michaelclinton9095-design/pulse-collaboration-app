const express = require('express');
const router = express.Router();
const { upload, uploadVoice, uploadFile } = require('../controllers/uploadController');

// Support upload.any() to handle voice, audio, file, or document field names resiliently
router.post('/voice', upload.any(), uploadVoice);
router.post('/file', upload.any(), uploadFile);

module.exports = router;
