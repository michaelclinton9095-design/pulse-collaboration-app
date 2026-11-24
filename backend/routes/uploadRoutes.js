const express = require('express');
const router = express.Router();
const { upload, uploadVoice, uploadFile } = require('../controllers/uploadController');

router.post('/voice', upload.single('voice'), uploadVoice);
router.post('/file', upload.single('file'), uploadFile);

module.exports = router;
