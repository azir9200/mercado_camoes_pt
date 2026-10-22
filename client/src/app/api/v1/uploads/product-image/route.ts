import { randomUUID } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp, { type Metadata } from 'sharp';
import { NextRequest, NextResponse } from 'next/server';

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const SUPPORTED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const SUPPORTED_FORMATS = new Set(['jpeg', 'png', 'webp', 'avif']);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');

    if (!(image instanceof File)) {
      return NextResponse.json({ success: false, error: 'Select an image to upload.' }, { status: 400 });
    }
    if (!SUPPORTED_MIME_TYPES.has(image.type)) {
      return NextResponse.json({ success: false, error: 'Use a JPEG, PNG, WebP, or AVIF image.' }, { status: 415 });
    }
    if (image.size === 0 || image.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ success: false, error: 'Image must be smaller than 8 MB.' }, { status: 413 });
    }

    const input = Buffer.from(await image.arrayBuffer());
    let metadata: Metadata;
    try {
      metadata = await sharp(input, { limitInputPixels: 40_000_000 }).metadata();
    } catch {
      return NextResponse.json({ success: false, error: 'The selected file is not a valid image.' }, { status: 400 });
    }

    if (!metadata.format || !SUPPORTED_FORMATS.has(metadata.format)) {
      return NextResponse.json({ success: false, error: 'Use a JPEG, PNG, WebP, or AVIF image.' }, { status: 415 });
    }

    const fileName = `${randomUUID()}.webp`;
    const uploadDirectory = process.env.PRODUCT_UPLOAD_DIR
      ? path.resolve(process.env.PRODUCT_UPLOAD_DIR)
      : path.join(process.cwd(), 'uploads', 'products');

    await mkdir(uploadDirectory, { recursive: true });
    await sharp(input, { limitInputPixels: 40_000_000 })
      .rotate()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(path.join(uploadDirectory, fileName));

    return NextResponse.json({
      success: true,
      data: { url: `/api/v1/uploads/products/${fileName}` }
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Image upload failed. Please try again.' }, { status: 500 });
  }
}