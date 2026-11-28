const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
const voiceDir = path.join(uploadDir, 'voice');
const filesDir = path.join(uploadDir, 'files');

[uploadDir, voiceDir, filesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'voice' || file.mimetype.startsWith('audio/')) {
      cb(null, voiceDir);
    } else {
      cb(null, filesDir);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || (file.mimetype.startsWith('audio/') ? '.webm' : '.dat');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

const uploadVoice = (req, res) => {
  const file = req.file || (req.files && (req.files.find(f => f.fieldname === 'voice' || f.fieldname === 'audio') || req.files[0]));
  if (!file) {
    return res.status(400).json({ error: 'No audio file provided' });
  }

  const fileUrl = `/uploads/voice/${file.filename}`;
  res.status(201).json({
    success: true,
    url: fileUrl,
    audioUrl: fileUrl,
    filename: file.filename,
    size: file.size
  });
};

const uploadFile = (req, res) => {
  const file = req.file || (req.files && (req.files.find(f => f.fieldname === 'file' || f.fieldname === 'document') || req.files[0]));
  if (!file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const fileUrl = `/uploads/files/${file.filename}`;
  res.status(201).json({
    success: true,
    url: fileUrl,
    fileUrl: fileUrl,
    fileName: file.originalname,
    fileSize: file.size,
    mimetype: file.mimetype
  });
};

module.exports = {
  upload,
  uploadVoice,
  uploadFile
};
