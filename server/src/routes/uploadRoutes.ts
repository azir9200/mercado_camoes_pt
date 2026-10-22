import { Router, RequestHandler } from 'express';
import multer from 'multer';
import { sendError } from '../utils/response.js';
import { getProductImage, productImageUpload, uploadProductImage } from '../controllers/uploadController.js';

const router = Router();

const handleProductImageUpload: RequestHandler = (req, res, next) => {
  productImageUpload.single('image')(req, res, (error?: unknown) => {
    if (!error) return next();
    if (error instanceof multer.MulterError) {
      const statusCode = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      return sendError(res, error.message, statusCode);
    }
    return sendError(res, error instanceof Error ? error.message : 'Invalid image upload.', 400);
  });
};

router.post('/product-image', handleProductImageUpload, uploadProductImage);
router.get('/products/:filename', getProductImage);

export default router;