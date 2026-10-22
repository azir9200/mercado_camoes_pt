import { randomUUID } from 'node:crypto';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import multer from 'multer';
import sharp, { type Metadata } from 'sharp';
import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../utils/response.js';

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const SUPPORTED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const SUPPORTED_FORMATS = new Set(['jpeg', 'png', 'webp', 'avif']);
const WEBP_FILENAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$/i;

export const productImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!SUPPORTED_MIME_TYPES.has(file.mimetype)) {
      callback(new Error('Use a JPEG, PNG, WebP, or AVIF image.'));
      return;
    }
    callback(null, true);
  }
});

export const uploadProductImage = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) return sendError(res, 'Select an image to upload.', 400);

  const input = file.buffer;
  let metadata: Metadata;
  try {
    metadata = await sharp(input, { limitInputPixels: 40_000_000 }).metadata();
  } catch {
    return sendError(res, 'The selected file is not a valid image.', 400);
  }

  if (!metadata.format || !SUPPORTED_FORMATS.has(metadata.format)) {
    return sendError(res, 'Use a JPEG, PNG, WebP, or AVIF image.', 415);
  }

  try {
    const uploadDirectory = process.env.PRODUCT_UPLOAD_DIR
      ? path.resolve(process.env.PRODUCT_UPLOAD_DIR)
      : path.join(process.cwd(), 'src', 'data', 'uploads', 'products');
    const fileName = `${randomUUID()}.webp`;

    await mkdir(uploadDirectory, { recursive: true });
    await sharp(input, { limitInputPixels: 40_000_000 })
      .rotate()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(path.join(uploadDirectory, fileName));

    return sendSuccess(res, { url: `/api/v1/uploads/products/${fileName}` });
  } catch {
    return sendError(res, 'Image upload failed. Please try again.', 500);
  }
};

export const getProductImage = async (req: Request, res: Response) => {
  const { filename } = req.params;
  if (!WEBP_FILENAME.test(filename)) return sendError(res, 'Image not found.', 404);

  const uploadDirectory = process.env.PRODUCT_UPLOAD_DIR
    ? path.resolve(process.env.PRODUCT_UPLOAD_DIR)
    : path.join(process.cwd(), 'src', 'data', 'uploads', 'products');

  try {
    const image = await readFile(path.join(uploadDirectory, filename));
    return res
      .status(200)
      .type('image/webp')
      .set('Cache-Control', 'public, max-age=31536000, immutable')
      .set('X-Content-Type-Options', 'nosniff')
      .send(image);
  } catch {
    return sendError(res, 'Image not found.', 404);
  }
};