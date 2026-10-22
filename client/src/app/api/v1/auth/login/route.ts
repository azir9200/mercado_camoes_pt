import { createHmac } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PHONE = process.env.ADMIN_LOGIN_ID || '+351 920 319 177';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET;

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json({ success: false, error: 'Identificador e palavra-passe são obrigatórios.' }, { status: 400 });
    }
    if (!ADMIN_PASSWORD || !ADMIN_TOKEN_SECRET) {
      return NextResponse.json({ success: false, error: 'Admin authentication is not configured.' }, { status: 503 });
    }

    const cleanInput = String(identifier).trim().toLowerCase();
    const isPhoneValid = cleanInput === ADMIN_PHONE.toLowerCase() || cleanInput.replace(/\s+/g, '') === ADMIN_PHONE.replace(/\s+/g, '');
    const isPasswordValid = String(password) === ADMIN_PASSWORD;

    if (!isPhoneValid || !isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas. Acesso restrito exclusivamente ao administrador (+351 920 319 177).' },
        { status: 401 }
      );
    }

    const payload = {
      phone: ADMIN_PHONE,
      role: 'SUPER_ADMIN',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    };
    const signature = createHmac('sha256', ADMIN_TOKEN_SECRET).update(JSON.stringify(payload)).digest('hex');
    const token = Buffer.from(JSON.stringify({ ...payload, signature })).toString('base64');

    return NextResponse.json({
      success: true,
      data: {
        token,
        admin: {
          name: 'Administrador Mercado De Camões',
          phone: ADMIN_PHONE,
          role: 'SUPER_ADMIN'
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
