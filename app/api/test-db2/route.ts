import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const tramites = await query('SELECT * FROM tramite_pago ORDER BY id DESC LIMIT 5');
    return NextResponse.json({ tramites });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
