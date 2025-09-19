const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { authenticateJWT } = require('../auth');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Upload image endpoint (admin only)
router.post('/image', authenticateJWT, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'events', // Organize images in 'events' folder
          transformation: [
            { width: 1200, height: 800, crop: 'fill', quality: 'auto' }, // Optimize for web
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    res.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: error.message 
    });
  }
});

// Delete image endpoint (admin only)
router.delete('/image/:publicId', authenticateJWT, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

module.exports = router;