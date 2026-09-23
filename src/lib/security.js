import { timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';

/**
 * Protects staff-only API endpoints. Keep ADMIN_API_KEY server-only (never
 * prefix it with NEXT_PUBLIC_) and send it as the x-admin-api-key header from
 * an authenticated admin application.
 */
export function requireAdmin(request) {
  const configuredKey = process.env.ADMIN_API_KEY;
  const suppliedKey = request.headers.get('x-admin-api-key');

  // Fail closed: a missing production secret must never expose write routes.
  if (!configuredKey || !suppliedKey) return false;

  const expected = Buffer.from(configuredKey);
  const actual = Buffer.from(suppliedKey);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function adminUnauthorizedResponse() {
  return NextResponse.json(
    { success: false, error: 'Administrator authentication is required' },
    { status: 401 }
  );
}
