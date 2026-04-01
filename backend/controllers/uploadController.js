const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Cấu hình Cloudinary (lấy từ env hoặc URL)
if (process.env.CLOUDINARY_URL) {
  // Cloudinary tự động cấu hình khi có CLOUDINARY_URL
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Dùng multer với memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Upload lên Cloudinary từ buffer
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'camera-store' },
      (error, result) => {
        if (error) return res.status(500).json({ message: 'Upload failed', error });
        res.json({ url: result.secure_url });
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
};

module.exports = { upload, uploadImage };