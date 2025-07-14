import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return new NextResponse('Site under maintenance', { status: 503 });
}
