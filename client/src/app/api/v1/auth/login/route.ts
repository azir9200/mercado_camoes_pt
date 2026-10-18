import { NextRequest, NextResponse } from 'next/server';

const AUTHORIZED_ADMIN_PHONES = [
  '+351 920 319 177',
  '+351920319177',
  '351920319177',
  '920319177',
  'admin'
];
const AUTHORIZED_ADMIN_PASSWORD = 'admin@12345';

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json({ success: false, error: 'Identificador e palavra-passe são obrigatórios.' }, { status: 400 });
    }

    const cleanInput = String(identifier).trim().toLowerCase();
    const isPhoneValid = AUTHORIZED_ADMIN_PHONES.some(
      p => p.toLowerCase() === cleanInput || cleanInput.replace(/\s+/g, '') === p.replace(/\s+/g, '')
    );
    const isPasswordValid = String(password).trim() === AUTHORIZED_ADMIN_PASSWORD;

    if (!isPhoneValid || !isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas. Acesso restrito exclusivamente ao administrador (+351 920 319 177).' },
        { status: 401 }
      );
    }

    const payload = {
      phone: '+351 920 319 177',
      role: 'SUPER_ADMIN',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    };
    const token = Buffer.from(JSON.stringify(payload)).toString('base64');

    return NextResponse.json({
      success: true,
      data: {
        token,
        admin: {
          name: 'Administrador Mercado De Camões',
          phone: '+351 920 319 177',
          role: 'SUPER_ADMIN'
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
