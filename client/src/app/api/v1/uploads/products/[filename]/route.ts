import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const WEBP_FILENAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  if (!WEBP_FILENAME.test(filename)) {
    return NextResponse.json({ success: false, error: 'Image not found.' }, { status: 404 });
  }

  const uploadDirectory = process.env.PRODUCT_UPLOAD_DIR
    ? path.resolve(process.env.PRODUCT_UPLOAD_DIR)
    : path.join(process.cwd(), 'uploads', 'products');

  try {
    const image = await readFile(path.join(uploadDirectory, filename));
    return new NextResponse(new Uint8Array(image), {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Image not found.' }, { status: 404 });
  }
}