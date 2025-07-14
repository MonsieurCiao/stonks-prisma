import { NextResponse } from 'next/server';


export function middleware() {
  return new NextResponse('Site under maintenance', { status: 503 });
}
